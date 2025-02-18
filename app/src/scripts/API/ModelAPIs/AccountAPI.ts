import {api} from "../API.ts";
import {Account, AccountInCreate, AccountInUpdate} from "../APITypes/Accounts.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import APIResponse from "../Responses/APIResponse.ts";

/**
 * This class is responsible for handling all the requests related to the Account endpoints.
 */
export default class AccountAPI {

    // The path to the Account endpoints.
    static ACCOUNTS_PATH = "/account";

    /**
     * This method builds and sends the request to get all the accounts.
     */
    static getAllAccounts(): Promise<APIResponse<Account[]>> {
        return api.requestLogged<Account[]>(
            HTTPMethod.GET,
            `${AccountAPI.ACCOUNTS_PATH}/`,
            undefined,
            undefined
        );
    }

    /**
     * This method builds and sends the request to get all the accounts.
     */
    static getAllAccountsNotLinkedToProfile(academic_year : number): Promise<APIResponse<Account[]>> {
        return api.requestLoggedWithAcademicYear<Account[]>(
            HTTPMethod.GET,
            `${AccountAPI.ACCOUNTS_PATH}/notlinked`,
            undefined,
            undefined
        );
    }

    /**
     * This method returns the account specified by the id provided.
     * @param account_id The id of the account to be returned.
     */
    static getAccountById(account_id: number): Promise<APIResponse<Account>> {
            return api.requestLogged<Account>(
            HTTPMethod.GET,
            `${AccountAPI.ACCOUNTS_PATH}/${account_id}`,
            undefined,
            undefined
        );
    }

    /**
     * This method builds and sends the request to create an account.
     * @param account The account to be created.
     */
    static createAccount(account: AccountInCreate): Promise<APIResponse<undefined>> {
        return api.requestLogged<undefined>(
            HTTPMethod.POST,
            `${AccountAPI.ACCOUNTS_PATH}/`,
            JSON.stringify(account),
            undefined
        );
    }

    /**
     * This method builds and sends the request to update an account.
     * @param account_id The id of the account to be updated.
     * @param account The account to be updated.
     */
    static updateAccount(account_id: number, account: AccountInUpdate): Promise<APIResponse<undefined>> {
        return api.requestLogged<undefined>(
            HTTPMethod.PATCH,
            `${AccountAPI.ACCOUNTS_PATH}/${account_id}`,
            JSON.stringify(account),
            undefined
        );
    }

    /**
     * This method builds and sends the request to delete an account.
     * @param account_id The id of the account to be deleted.
     */
    static deleteAccount(account_id: number): Promise<APIResponse<undefined>> {
        return api.requestLogged<undefined>(
            HTTPMethod.DELETE,
            `${AccountAPI.ACCOUNTS_PATH}/${account_id}`,
            undefined,
            undefined
        );
    }

    /**
     * This method return all the accounts that have satisfied the search query.
     * @param query The query to search for.
     * @returns A promise that resolves to an array of accounts or an error.
     */
    static searchAccountsByKeywords(keywords: string): Promise<APIResponse<Account[]>> {
        return api.requestLogged<Account[]>(
            HTTPMethod.GET,
            `${AccountAPI.ACCOUNTS_PATH}/search/${keywords}`,
            undefined,
            undefined
        );
    }
}