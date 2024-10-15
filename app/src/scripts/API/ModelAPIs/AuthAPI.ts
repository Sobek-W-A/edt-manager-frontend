import CorrectResponse from "../Responses/CorrectResponse.ts";
import {TokenPair} from "../APITypes/Tokens.ts";
import ErrorResponse from "../Responses/ErrorResponse.ts";
import {api} from "../API.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";

import {ConfirmationMessage} from "../APITypes/CommonTypes.ts";

/**
 * API methods for auth endpoints.
 */
export default class AuthAPI {

    /* The base path of the authentication methods. */
    static BASE_AUTH_URL: string = '/auth';

    /**
     * This method builds and sends the request to log the user.
     * @param login Login to athenticate the user.
     * @param password Password to authenticate the user.
     * @returns A promise that is either a pair of token or an error.
     */
    static loginRequest(login: string, password: string): Promise<CorrectResponse<TokenPair> | ErrorResponse> {
        const body = {
            username: login,
            password: password,
        }
        return api.request<TokenPair>(
            HTTPMethod.POST,
            AuthAPI.BASE_AUTH_URL + "/login",
            JSON.stringify(body),
            undefined,
            undefined
        );
    }

    /**
     * This method builds and sends the request to disconnect the user.
     * @param access_token  Access token to revoke.
     * @param refresh_token Refresh token to revoke.
     * @returns A promise that is either a confirmation message or an error.
     */
    static logoutRequest(access_token: string, refresh_token: string): Promise<CorrectResponse<ConfirmationMessage> | ErrorResponse>  {
        const body = {
            access_token: access_token,
            refresh_token: refresh_token,
        }
        return api.request<ConfirmationMessage>(
            HTTPMethod.POST,
            AuthAPI.BASE_AUTH_URL + "/logout",
            JSON.stringify(body),
            undefined,
            undefined
        );
    }

    /**
     * This method builds and sends the request to refresh the user's tokens.
     * @param refresh_token Token to use in order to refresh the user's token.
     * @returns A Promise that is either a new token pair or an error.
     */
    static refreshTokensRequest(refresh_token: string) : Promise<CorrectResponse<TokenPair> | ErrorResponse> {
        const body = {
            refresh_token: refresh_token,
        }
        return api.request<TokenPair>(
            HTTPMethod.POST,
            AuthAPI.BASE_AUTH_URL + "/refresh",
            JSON.stringify(body),
            undefined,
            undefined
        );
    }

}