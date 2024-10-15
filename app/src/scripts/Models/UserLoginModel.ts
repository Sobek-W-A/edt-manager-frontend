import UserModel from "./UserModel.ts";
import UserAPI from "../API/ModelAPIs/UserAPI.ts";
import Storage from "../API/Storage.ts";
import {TokenPair} from "../API/APITypes/Tokens.ts";
import CorrectResponse from "../API/Responses/CorrectResponse.ts";
import ErrorResponse from "../API/Responses/ErrorResponse.ts";

export default class UserLoginModel extends UserModel {

    private readonly _login   : string;
    private readonly _password: string;

    constructor(login: string, password: string) {
        super();
        this._login    = login;
        this._password = password;
    }


    async loginUser(): Promise<CorrectResponse<TokenPair> | ErrorResponse> {
        return await UserAPI.loginUserRequest(this._login, this._password);
    }

    static async logoutUser() {
        return await UserAPI.logoutUserRequest(
            Storage.getAccessTokenFromStorage(),
            Storage.getRefreshTokenFromStorage()
        );
    }

    static async refreshTokens(): Promise<void> {
        const response = await UserAPI.refreshTokensRequest(
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