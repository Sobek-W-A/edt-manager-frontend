import Storage from "../API/Storage.ts";
import {TokenPair} from "../API/APITypes/Tokens.ts";
import CorrectResponse from "../API/Responses/CorrectResponse.ts";
import AuthAPI from "../API/ModelAPIs/AuthAPI.ts";
import APIResponse from "../API/Responses/APIResponse.ts";

/**
 * This class provides handling methods for the authentication process of the user.
 */
export default class AuthModel {

    private readonly _login   : string;
    private readonly _password: string;
    static BASE_LOGIN_URL: string = '/login';

    constructor(login: string, password: string) {
        this._login    = login;
        this._password = password;
    }

    /**
     * This method checks if the user is logged in.
     * @returns A boolean that is true if the user is logged in, false otherwise.
     */
    static isLoggedIn(): boolean {
        return Storage.isAccessTokenStored();
    }

    /**
     * This method authenticates the user to the API.
     * Requires login and password to be set.
     * @returns A promise that resolves into a pair of tokens, or an error.
     */
    async login(): Promise<APIResponse<TokenPair>> {
        const res: APIResponse<TokenPair> = await AuthAPI.loginRequest(this._login, this._password);
        if (!res.isError()) {
            Storage.setTokensInStorage(
                (res as CorrectResponse<TokenPair>).responseObject().access_token,
                (res as CorrectResponse<TokenPair>).responseObject().refresh_token
            );
        }
        return res;
    }

    /**
     * This method disconnect the user to the API.
     * It sends the tokens to the API in order to be invalidated.
     * Upon resolving, the Storage is cleared and the window is reloaded.
     * @returns A promise that resolves into void.
     */
    static async logout() : Promise<void> {
        await AuthAPI.logoutRequest(
            Storage.getAccessTokenFromStorage(),
            Storage.getRefreshTokenFromStorage()
        );
        Storage.cleanStorage();
        window.location.href = AuthModel.BASE_LOGIN_URL;
    }

    /**
     * This method refreshes the tokens used to make logged requests.
     * It sends the refresh token to the API in order to generate a new pair.
     *
     * Upon resolving, if an error has occurred, the Storage is cleared and the window is reloaded.
     * Otherwise, the new pair of token is saved into storage.
     * @returns A promise that resolves into void.
     */
    static async refreshTokens(): Promise<void> {
        const response = await AuthAPI.refreshTokensRequest(
            Storage.getRefreshTokenFromStorage(),
        );
        if (response.isError()) {
            Storage.cleanStorage();
            window.location.reload();
        } else {
            Storage.setTokensInStorage(
                (response as CorrectResponse<TokenPair>).responseObject().access_token,
                (response as CorrectResponse<TokenPair>).responseObject().refresh_token
            );
        }
    }

}