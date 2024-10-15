import UserModel from "./UserModel.ts";
import APIResponse from "../API/Responses/APIResponse.ts";
import UserAPI from "../API/ModelAPIs/UserAPI.ts";
import Storage from "../API/Storage.ts";

export default class UserLoginModel extends UserModel {

    private readonly _login   : string;
    private readonly _password: string;

    constructor(login: string, password: string) {
        super();
        this._login    = login;
        this._password = password;
    }


    async loginUser(): Promise<APIResponse> {
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
                response.responseObject()["access_token"],
                response.responseObject()["refresh_token"]
            );
        }
    }

}