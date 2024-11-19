import {TokenPair} from "../APITypes/Tokens.ts";
import {api} from "../API.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import {ContentType} from "../Enums/ContentType.ts";

import {ConfirmationMessage} from "../APITypes/CommonTypes.ts";
import APIResponse from "../Responses/APIResponse.ts";

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
    static loginRequest(login: string, password: string): Promise<APIResponse<TokenPair>> {
        // Créer les données au format x-www-form-urlencoded
        // Bien utiliser URLSearchParams pour éviter les problèmes de caractères spéciaux
        const formData = new URLSearchParams();
        formData.append('username', login);
        formData.append('password', password);

        return api.request<TokenPair>(
            HTTPMethod.POST,
            AuthAPI.BASE_AUTH_URL + "/login",
            formData.toString(),
            ContentType.URL_ENCODED,
            undefined
        );
    }

    /**
     * This method builds and sends the request to disconnect the user.
     * @param access_token  Access token to revoke.
     * @param refresh_token Refresh token to revoke.
     * @returns A promise that is either a confirmation message or an error.
     */
    static logoutRequest(access_token: string, refresh_token: string): Promise<APIResponse<ConfirmationMessage>>  {
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
    static refreshTokensRequest(refresh_token: string) : Promise<APIResponse<TokenPair>> {
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