import APIResponse from "../Responses/APIResponse.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import {api} from "../API.ts";
import { RoleType } from "../APITypes/Role.ts";

/**
 * API methods for user endpoints.
 */
export default class RoleAPI {
    static ACCOUNTS_PATH = "/account";
    static ROLE_URL: string = '/role';

    static getAllRoles(): Promise<APIResponse<RoleType[]>> {
        return api.requestLogged<RoleType[]>(
            HTTPMethod.GET,
            `${RoleAPI.ROLE_URL}/`,
            undefined,
            undefined
        );
    }

    /**
     * Function to get the role of a user.
     * 
     * @param userId The user id to fetch for.
     * @returns A promise that resolves into an array of roles or an error.
     */
    static getUserRoles(account_id: number, academic_year: string): Promise<APIResponse<RoleType[]>> {
        return api.requestLogged<RoleType[]>(
            HTTPMethod.GET,
            `${RoleAPI.ACCOUNTS_PATH}/${account_id}${RoleAPI.ROLE_URL}/${academic_year}`,
            undefined,
            undefined
        );
    }

    /**
     * Function to modify the role of a user.
     * 
     * @param account_id The user id to modify.
     * @returns A promise that resolves into a role or an error.
     */
    static modifyUserRole(account_id: number, role: RoleType | "", academic_year: string): Promise<APIResponse<RoleType>> {
        return api.requestLogged<RoleType>(
            HTTPMethod.PATCH,
            `${RoleAPI.ACCOUNTS_PATH}/${account_id}${RoleAPI.ROLE_URL}/`,
            JSON.stringify({ name: role ? role.name : "", academic_year }),
            undefined
        );
    }
}
