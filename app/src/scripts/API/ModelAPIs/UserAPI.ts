import {api} from "../API.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import {TokenPair} from "../APITypes/Tokens.ts";
import {ConfirmationMessage} from "../APITypes/ConfirmationMessage.ts";
import CorrectResponse from "../Responses/CorrectResponse.ts";
import ErrorResponse from "../Responses/ErrorResponse.ts";

export default class UserAPI {

    static BASE_USER_URL: string = '/user';
    static BASE_AUTH_URL: string = '/auth';

    static loginUserRequest(login: string, password: string): Promise<CorrectResponse<TokenPair> | ErrorResponse> {
        const body = {
            username: login,
            password: password,
        }
        return api.request<TokenPair>(
            HTTPMethod.POST,
            UserAPI.BASE_AUTH_URL + "/login",
            JSON.stringify(body),
            undefined,
            undefined
        );
    }

    static logoutUserRequest(access_token: string, refresh_token: string): Promise<CorrectResponse<ConfirmationMessage> | ErrorResponse>  {
        const body = {
            access_token: access_token,
            refresh_token: refresh_token,
        }
        return api.request<ConfirmationMessage>(
            HTTPMethod.POST,
            UserAPI.BASE_AUTH_URL + "/logout",
            JSON.stringify(body),
            undefined,
            undefined
        );
    }

    static refreshTokensRequest(refresh_token: string) : Promise<CorrectResponse<TokenPair> | ErrorResponse> {
        const body = {
            refresh_token: refresh_token,
        }
        return api.request<TokenPair>(
            HTTPMethod.POST,
            UserAPI.BASE_AUTH_URL + "/refresh",
            JSON.stringify(body),
            undefined,
            undefined
        );
    }
}