import APIResponse from "./APIResponse.ts";
import ErrorResponse from "./ErrorResponse.ts";
import CorrectResponse from "./CorrectResponse.ts";
import Data from "../../assets/Data.ts";
import {HTTPMethod} from "./HTTPMethod.ts";
import {ContentType} from "./ContentType.ts";
import Storage from "./Storage.ts";

class API {

    /**
     * Base API URL.
     */
    static API_URL = "http://localhost:8000";


    private static INSTANCE : API;
    private isRefreshing    : boolean          = false;
    private refreshLock     : Promise<unknown> = Promise.resolve();


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
    async request(method: HTTPMethod, url: string, body: BodyInit, supplied_content_type: ContentType = ContentType.JSON, headers: {[key: string]: string }): Promise<APIResponse> {
        // Building header for the request
        const header: {[key: string]: string } = {
            "Access-Control-Allow-Origin": API.API_URL,
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
                        resolve(new ErrorResponse(504 ,
                            "Timeout waiting for response after "
                            + Data.PROGRAM_VALUES.TIMEOUT_BEFORE_REQUEST_FAILURE + " ms"))
                        },
                Data.PROGRAM_VALUES.TIMEOUT_BEFORE_REQUEST_FAILURE);

            // Fetching data from the server
            fetch(`${API.API_URL}${url}`,
                {
                    method: method,
                    headers: header,
                    mode: 'cors',
                    body: body
                })
                .then(async (response) => {
                    // When we got our response, we check the status code.
                    const data = await response.json();
                    if(response.status >= 200 && response.status < 300) {
                        resolve(new CorrectResponse(data));
                    } else {
                        resolve(new ErrorResponse(response.status, data.detail));
                    }
                })
        });
    }

    /**
     * This method is a superset of the request() method.
     * It adds to the request the necessary headers to make authenticated requests.
     * It also handles the refreshing of the user's tokens in case they have expired.
     *
     * @param method
     * @param url
     * @param body
     * @param content_type
     * @returns {Promise<APIResponse>}
     */
    async requestLogged(method: HTTPMethod, url: string, body: BodyInit, content_type: ContentType) {

        let response;
        let authHeader = {['Authorization'] : `Bearer ${ Storage.getAccessTokenFromStorage() }`};
        if (!this.isRefreshing){
            response = await this.request(method, url, body, content_type, authHeader);

            // If we are not refreshing the token, we try refreshing it.
            if ((response.isError() && response.errorCode === 401) && !this.isRefreshing) {
                this.isRefreshing = true;
                // If we were not able to refresh the tokens :
                // Logout the user, redirect to login page, etc... are handled by the refresh tokens method
                this.refreshLock = UserLoginModel.refreshTokens()
                    .then(() => { this.isRefreshing = false });
            }

            // Wait for the current refresh to complete before continuing
            await this.refreshLock;
            authHeader = {['Authorization'] : `Bearer ${ Storage.getAccessTokenFromStorage() }`};
            response = await this.request(method, url, body, content_type, authHeader);




        } else {

        }

        // If we get an Unauthorized response
        // It would be of APIResponse type, so we can use default fields from this class
        if (this.isRefreshing || ) {


        }
        return response;
    }
}
export const api = new API();