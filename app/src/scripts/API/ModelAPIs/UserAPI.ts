import APIResponse from "../APIResponse.ts";
import {api} from "../API.ts";
import {HTTPMethod} from "../HTTPMethod.ts";

export default class UserAPI {

    static BASE_USER_URL: string = '/user';
    static BASE_AUTH_URL: string = '/auth';

    static loginUserRequest(login: string, password: string): Promise<APIResponse> {
        const body = {
            username: login,
            password: password,
        }
        return api.request(
            HTTPMethod.POST,
            UserAPI.BASE_AUTH_URL + "/login",
            JSON.stringify(body),
            undefined,
            undefined
        );
    }

    static logoutUserRequest(access_token: string, refresh_token: string): Promise<APIResponse>  {
        const body = {
            access_token: access_token,
            refresh_token: refresh_token,
        }
        return api.request(
            HTTPMethod.POST,
            UserAPI.BASE_AUTH_URL + "/logout",
            JSON.stringify(body),
            undefined,
            undefined
        );
    }

    static refreshTokensRequest(refresh_token: string) : Promise<APIResponse> {
        const body = {
            refresh_token: refresh_token,
        }
        return api.request(
            HTTPMethod.POST,
            UserAPI.BASE_AUTH_URL + "/refresh",
            JSON.stringify(body),
            undefined,
            undefined
        );
    }
}