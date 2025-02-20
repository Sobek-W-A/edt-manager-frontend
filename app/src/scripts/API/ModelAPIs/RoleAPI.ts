import APIResponse from "../Responses/APIResponse.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import {api} from "../API.ts";
import { RoleInPatchType, RoleType } from "../APITypes/Role.ts";

/**
 * API methods for user endpoints.
 */
export default class RoleAPI {
    static ACCOUNTS_PATH = "/account";
    static ROLE_URL: string = '/role';
    static ROLE_DEFAULT: RoleInPatchType = { name: "Non assigné"};

    static getAllRoles(): Promise<APIResponse<RoleType[]>> {
        return api.requestLoggedWithAcademicYear<RoleType[]>(
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
    static getUserRoles(account_id: number): Promise<APIResponse<RoleType>> {
        return api.requestLoggedWithAcademicYear<RoleType>(
            HTTPMethod.GET,
            `${RoleAPI.ACCOUNTS_PATH}/${account_id}${RoleAPI.ROLE_URL}`,
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
    static modifyUserRole(account_id: number, role: RoleType, academic_year: string): Promise<APIResponse<RoleType>> {
        return api.requestLoggedWithAcademicYear<RoleType>(
            HTTPMethod.PATCH,
            `${RoleAPI.ACCOUNTS_PATH}/${account_id}${RoleAPI.ROLE_URL}/`,
            JSON.stringify({ name: role ? role.name : RoleAPI.ROLE_DEFAULT.name, academic_year }),
            undefined
        );
    }

    /**
     * Function to remove a role to a user.
     * 
     * @param account_id The user id to modify.
     * @returns A promise that resolves into a role or an error.
     */
    static removeUserRole(account_id: number, academic_year: string): Promise<APIResponse<undefined>> {
        return api.requestLoggedWithAcademicYear<undefined>(
            HTTPMethod.PATCH,
            `${RoleAPI.ACCOUNTS_PATH}/${account_id}${RoleAPI.ROLE_URL}/`,
            JSON.stringify({ name: RoleAPI.ROLE_DEFAULT.name, academic_year }),
            undefined
        );
    }
}
