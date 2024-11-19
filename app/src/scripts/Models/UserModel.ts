import {UserInCreateType, UserInPatchType, UserType} from "../API/APITypes/Users.ts";
import UserAPI from "../API/ModelAPIs/UserAPI.ts";
import APIResponse from "../API/Responses/APIResponse.ts";
import ErrorResponse from "../API/Responses/ErrorResponse.ts";

/**
 * A classic model that provides handling methods for actions that concerns a User.
 */
export default class UserModel {

    private _id:               number;
    private _login:            string;
    private _mail:             string;
    private _firstname:        string;
    private _lastname:         string;
    private _password:         string | null = null;
    private _password_confirm: string | null = null;

    constructor(user_data: UserType) {
        this._id = user_data.id;
        this._login = user_data.login;
        this._mail = user_data.mail;
        this._firstname = user_data.firstname;
        this._lastname = user_data.lastname;
    }

    /**
     * This method builds a UserModel filled with the information of the currently logged user.
     * @returns A promise that resolves into a UserModel or an ErrorResponse.
     */
    static async getCurrentUser(): Promise<UserModel | ErrorResponse<UserType>>  {
        const response: APIResponse<UserType> = await UserAPI.getCurrentUser();
        if (response.isError()) return (response as ErrorResponse<UserType>);

        return new UserModel(response.responseObject());
    }

    /**
     * This method builds a UserModel filled with the information of the user qualified by the id provided.
     * @param user_id User ID to find information from.
     * @returns A promise that resolves into a UserModel or an ErrorResponse.
     */
    static async getUserById(user_id: number): Promise<UserModel | ErrorResponse<UserType>> {
        const response: APIResponse<UserType> = await UserAPI.getUserByID(user_id);
        if (response.isError()) return (response as ErrorResponse<UserType>);

        return new UserModel(response.responseObject());
    }

    /**
     * This method builds an array of UserModel based on the users registered on the API.
     * @returns A promise that is either an array of UserModel or an error.
     */
    static async getAllUsers(): Promise<UserModel[] | ErrorResponse<UserType[]>> {
        const response: APIResponse<UserType[]> = await UserAPI.getAllUsers();
        if (response.isError()) return (response as ErrorResponse<UserType[]>);

        const result: UserModel[] = [];
        response.responseObject().forEach((element: UserType) => { result.push(new UserModel(element)); });
        return result;
    }

    /**
     * This method creates the user described by the current user instance.
     * @returns Either no response or an error response.
     */
    async createUser(): Promise<undefined | ErrorResponse<undefined>> {
        const body: UserInCreateType = {
            login: this._login,
            mail: this._mail,
            firstname: this._firstname,
            lastname: this._lastname,
            password: this._password === null ? "" : this._password,
            password_confirm: this._password_confirm === null ? "" : this._password_confirm,
        }
        const result: APIResponse<undefined> = await UserAPI.createUser(body);
        return result.isError() ? (result as ErrorResponse<undefined>) : undefined;
    }

    /**
     * This method updates a user described by the current user instance.
     * @returns Either no response or an error response.
     */
    async updateUser(newData: UserInPatchType): Promise<undefined | ErrorResponse<undefined>> {
        const body: UserInPatchType = {
            login: newData.login === this._login ? undefined : newData.login,
            mail: newData.mail === this._mail ? undefined : newData.mail,
            firstname: newData.firstname === this._firstname ? undefined : newData.firstname,
            lastname: newData.lastname === this._lastname ? undefined : newData.lastname,
            password: newData.password,
            password_confirm: newData.password_confirm,
        }
        const response: APIResponse<undefined> = await UserAPI.updateUser(this._id, body);
        if (response.isError()) return (response as ErrorResponse<undefined>);
    }

    /**
     * This method deletes the current user instance.
     * @returns Either no response or an error response.
     */
    async deleteUser(): Promise<undefined | ErrorResponse<undefined>> {
        const res : APIResponse<undefined> = await UserAPI.deleteUser(this._id);
        return res.isError() ? (res as ErrorResponse<undefined>) : undefined;
    }

    /**
     * This method simply sets the passwords provided into the current object.
     * @param password Password to set
     * @param password_confirm Password confirmation to set
     */
    setPasswords(password: string, password_confirm: string): void {
        this._password = password;
        this._password_confirm = password_confirm;
    }

    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }
    get login(): string {
        return this._login;
    }
    set login(value: string) {
        this._login = value;
    }
    get mail(): string {
        return this._mail;
    }
    set mail(value: string) {
        this._mail = value;
    }
    get firstname(): string {
        return this._firstname;
    }
    set firstname(value: string) {
        this._firstname = value;
    }
    get lastname(): string {
        return this._lastname;
    }
    set lastname(value: string) {
        this._lastname = value;
    }
    get password(): string | null {
        return this._password;
    }
    set password(value: string | null) {
        this._password = value;
    }
    get password_confirm(): string | null {
        return this._password_confirm;
    }
    set password_confirm(value: string | null) {
        this._password_confirm = value;
    }
}
