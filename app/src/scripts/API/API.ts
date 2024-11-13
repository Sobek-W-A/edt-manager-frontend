import ErrorResponse from "./Responses/ErrorResponse.ts";
import CorrectResponse from "./Responses/CorrectResponse.ts";
import Data from "../../assets/Data.ts";
import {HTTPMethod} from "./Enums/HTTPMethod.ts";
import {ContentType} from "./Enums/ContentType.ts";
import Storage from "./Storage.ts";
import AuthModel from "../Models/AuthModel.ts";

import {APIErrorResponse} from "./APITypes/CommonTypes.ts";
import APIResponse from "./Responses/APIResponse.ts";

/**
 * This class is designed to make API calls, logged or not.
 */
class API {

    /** Base API URL. Used to contact the backend application. */
    public API_URL = "http://localhost:8000";

    /**
     * Instance of the API module. It is used to avoid any duplicates of this class and
     * ensure that the request management is centralized.
     */
    private static INSTANCE : API;

    /**
     * This variable is used to "lock" the API when credentials are being refreshed to avoid unpleasant behavior.
     * @private
     */
    private isRefreshing    : boolean          = false;

    /**
     *  This variable is the promise filled by the refresh tokens method. It can be used to block outgoing requests while the token
     *  are refreshing and to send them back once the process is complete.
     * @private
     */
    private refreshLock     : Promise<unknown> = Promise.resolve();

    /**
     * Constructor for the API class.
     */
    constructor() {
        if (!API.INSTANCE) {
            API.INSTANCE = this;
        }
        return API.INSTANCE;
    }


    /**
     * Method that needs to be used to communicate with the API.
     *
     * @param method HTTP method that needs to be used to fetch.
     * @param url Path for the route that we need to fetch.
     * @param body Body send with the request (data that needs to be sent).
     * @param supplied_content_type Body's content type.
     * @param headers Additional headers (mainly used to authenticate the user)
     * @returns {Promise<APIResponse>} Returns the promise for the request.
     */
    async request<T>(method: HTTPMethod, url: string, body: BodyInit | undefined, supplied_content_type: ContentType = ContentType.JSON, headers: {[key: string]: string } | undefined): Promise<APIResponse<T>> {
        // Building header for the request
        const header: {[key: string]: string } = {
            "Access-Control-Allow-Origin": api.API_URL,
            "Accept": ContentType.JSON,                 // <- Indicates what data the application accepts
            "Origin": window.location.origin,
        };
        // Checking if content-type needs to be specified.
        if (supplied_content_type !== ContentType.FORM_DATA ) { header["Content-Type"] = supplied_content_type; }
        // Adding eventual headers.
        // Mainly used for adding identification headers.
        for (const key in headers) { header[key] = headers[key]; }

        // Preparing fetch request.
        return new Promise((resolve) => {
            // Setting up the timeout mechanism :
            setTimeout(() => {
                        resolve(new ErrorResponse<T>(504 ,
                            "Timeout waiting for response after "
                            + Data.PROGRAM_VALUES.TIMEOUT_BEFORE_REQUEST_FAILURE + " ms"))
                        },
                Data.PROGRAM_VALUES.TIMEOUT_BEFORE_REQUEST_FAILURE);

            // Fetching data from the server
            fetch(`${api.API_URL}${url}`,
                {
                    method: method,
                    headers: header,
                    mode: 'cors',
                    body: body
                })
                .then(async (response) => {
                    // When we got our response, we check the status code.
                    // If it is a no content response, we resolve this as nothing.
                    if (response.status === 204 || response.status === 205) {
                        resolve(new CorrectResponse<T>(undefined as T));
                    } else {
                        const data: T = await response.json();
                        if(response.status >= 200 && response.status < 300) {
                            resolve(new CorrectResponse<T>(data));
                        } else {
                            const errorMessage = (data as APIErrorResponse)["detail"] ||
                                (data as APIErrorResponse)["message"] ||
                                "An unknown error occurred";
                            resolve(new ErrorResponse(response.status, errorMessage));
                        }
                    }
                })
        });
    }

    /**
     * This method is a superset of the request() method.
     * It adds to the request the necessary headers to make authenticated requests.
     * It also handles the refreshing of the user's tokens in case they have expired.
     *
     * @param method HTTP method that needs to be used to fetch.
     * @param url Path for the route that we need to fetch.
     * @param body Body send with the request (data that needs to be sent).
     * @param content_type Body's content type.
     * @returns {Promise<APIResponse>}
     */
    async requestLogged<T>(method: HTTPMethod, url: string, body: BodyInit | undefined, content_type: ContentType = ContentType.JSON): Promise<APIResponse<T>> {

        let response;
        let authHeader = {['Authorization'] : `Bearer ${ Storage.getAccessTokenFromStorage() }`};
        if (!this.isRefreshing){
            response = await this.request<T>(method, url, body, content_type, authHeader);

            // If we are not refreshing the token, we try refreshing it.
            if ((response.isError() && response.errorCode() === 401) && !this.isRefreshing) {
                this.isRefreshing = true;
                // If we were not able to refresh the tokens :
                // Logout the user, redirect to login page, etc... are handled by the refresh tokens method
                this.refreshLock = AuthModel.refreshTokens()
                    .then(() => { this.isRefreshing = false });

                // Wait for the current refresh to complete before continuing
                await this.refreshLock;
                authHeader = {['Authorization'] : `Bearer ${ Storage.getAccessTokenFromStorage() }`};
                return await this.request<T>(method, url, body, content_type, authHeader);
            }

            return response;
        } else {
            // Wait for the current refresh to complete before continuing
            await this.refreshLock;
            authHeader = {['Authorization'] : `Bearer ${ Storage.getAccessTokenFromStorage() }`};
            return await this.request<T>(method, url, body, content_type, authHeader);
        }
    }
}
export const api = new API();