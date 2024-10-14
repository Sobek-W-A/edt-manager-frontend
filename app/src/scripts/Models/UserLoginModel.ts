import UserModel from "./UserModel.ts";
import APIResponse from "../API/APIResponse.ts";
import {api} from "../API/API.ts";

export default class UserLoginModel extends UserModel {

    private _login   : string | undefined;
    private _password: string | undefined;

    constructor(login: string, password: string) {
        super();
        this._login    = login;
        this._password = password;
    }


    static refreshTokens() : Promise<APIResponse> {
        return api.request(

        ).then(

        );
    }
}