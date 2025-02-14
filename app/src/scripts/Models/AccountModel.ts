import {Account, AccountInCreate, AccountInUpdate} from "../API/APITypes/Accounts.ts";
import AccountAPI from "../API/ModelAPIs/AccountAPI.ts";
import ErrorResponse from "../API/Responses/ErrorResponse.ts";

/**
 * A classic model that provides handling methods for actions that concerns an Account.
 * This model is used to handle authentication in backend.
 */
export default class AccountModel {

    private _id               : number;
    private _login            : string;
    private _password         : string | undefined;
    private _password_confirm : string | undefined;

    /**
     * This constructor initializes the AccountModel with the account provided.
     * @param account Account to initialize the model with.
     */
    constructor(account: Account) {
        this._id               = account.id;
        this._login            = account.login;
        this._password         = undefined;
        this._password_confirm = undefined;
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

    /**
     * This method sends and handles the request to get all AccountModel from the API.
     * @returns A promise that resolves into an array of AccountModel or an ErrorResponse.
     */
    static async getAllAccounts(): Promise<AccountModel[] | ErrorResponse<Account[]>> {
        const response = await AccountAPI.getAllAccounts();

        const result: AccountModel[] = [];
        if (response.isError()) return result;
        response.responseObject().forEach((element: Account) => {
            result.push(new AccountModel(element));
        });
        return result
    }

    /**
     * This method sends and handles the request to get all AccountModel from the API.
     * @returns A promise that resolves into an array of AccountModel or an ErrorResponse.
     */
    static async getAllAccountsNotLinkedToProfile(academic_year : number): Promise<AccountModel[] | ErrorResponse<Account[]>> {
        const response = await AccountAPI.getAllAccountsNotLinkedToProfile(academic_year);

        const result: AccountModel[] = [];
        if (response.isError()) return result;
        response.responseObject().forEach((element: Account) => {
            result.push(new AccountModel(element));
        });
        return result
    }

    /**
     * This method gets and builds an AccountModel based on the account_id provided.
     * @param account_id The id of the account to be returned.
     * @returns A promise that resolves into an AccountModel or an ErrorResponse.
     */
    static async getAccountById(account_id: number): Promise<AccountModel | ErrorResponse<Account>> {
        const response = await AccountAPI.getAccountById(account_id);
        if (response.isError()) return response as ErrorResponse<Account>;
        return new AccountModel(response.responseObject());
    }

    /**
     * This method uses the current instance of Account Model to create an account.
     * @returns A promise that resolves into an APIResponse.
     */
    async createAccount(): Promise<undefined | ErrorResponse<undefined>> {
        const account: AccountInCreate = {
            login           : this._login,
            password        : this._password ?? "",
            password_confirm: this._password_confirm ?? ""
        }
        const response = await AccountAPI.createAccount(account);
        return response.isError() ? response as ErrorResponse<undefined> : undefined;
    }

    /**
     * This method uses the current instance of Account Model to update an account.
     * @returns A promise that resolves into an APIResponse.
     */
    async updateAccount(newData: AccountInUpdate): Promise<undefined | ErrorResponse<undefined>> {
        const account: AccountInUpdate = {
            login: newData.login === this._login ? undefined : newData.login,
            password: this._password,
            password_confirm: this._password_confirm
        }
        const response = await AccountAPI.updateAccount(this._id, account);
        return response.isError() ? response as ErrorResponse<undefined> : undefined;
    }

    /**
     * This method uses the current instance of Account Model to delete an account.
     * Uses the id of the current instance to delete the account.
     * @returns A promise that resolves into an APIResponse.
     */
    async deleteAccount(): Promise<undefined | ErrorResponse<undefined>> {
        const response = await AccountAPI.deleteAccount(this._id);
        return response.isError() ? response as ErrorResponse<undefined> : undefined;
    }


    get password_confirm(): string | undefined {
        return this._password_confirm;
    }
    set password_confirm(value: string) {
        this._password_confirm = value;
    }
    get password(): string | undefined {
        return this._password;
    }
    set password(value: string) {
        this._password = value;
    }
    get login(): string {
        return this._login;
    }
    set login(value: string) {
        this._login = value;
    }
    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }
}