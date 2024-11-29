import { ConfirmationMessage } from "../APITypes/CommonTypes";
import APIResponse from "../Responses/APIResponse.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import {api} from "../API.ts";
import {Profile, ProfileInCreate, ProfileInUpdate} from "../APITypes/Profiles.ts";

/**
 * API methods for user endpoints.
 */
export default class RoleAPI {
    static usersRoles: { id: number, roles: string[] }[] = [];

    static ROLE_URL: string = '/role';

    static rolesList: string[] = [
        "Responsable de département",
        "Responsable de formation",
        "Secrétariat pédagogique",
        "Enseignant"
    ];

    /**
     * Simulate getting the roles
     */
    static getRoles(): Promise<APIResponse<string[]>> {
        return Promise.resolve({
            isError: () => false,
            errorCode: () => 0,
            errorMessage: () => "",
            responseObject: () => this.rolesList
        });
    }

    static getAllRoles(): Promise<APIResponse<string[]>> {
        return api.requestLogged<string[]>(
            HTTPMethod.GET,
            `${RoleAPI.ROLE_URL}/`,
            undefined,
            undefined
        );
    }

    /**
     * Simulate getting the roles of a user.
     * @param userId The user id to fetch for.
     */
    static getUserRoles(userId: number): Promise<APIResponse<string[]>> {
        const user = this.usersRoles.find(user => user.id === userId);
        if (user) {
            return Promise.resolve({
                isError: () => false,
                errorCode: () => 200,
                errorMessage: () => "",
                responseObject: () => user.roles
            });
        } else {
            return Promise.resolve({
                isError: () => true,
                errorCode: () => 404,
                errorMessage: () => "Utilisateur non trouvé",
                responseObject: () => []
            });
        }
    }

    /**
     * Simulate adding a role to a user.
     * @param userId The user's id.
     * @param role The role to add.
     */
    static addRoleToUser(userId: number, role: string): Promise<APIResponse<{ roles: string[], message: ConfirmationMessage }>> {
        const user = this.usersRoles.find(user => user.id === userId);
        if (user && !user.roles.includes(role)) {
            user.roles.push(role);
        } else if (!user) {
            this.usersRoles.push({ id: userId, roles: [role] });
        }
        return Promise.resolve({
            isError: () => false,
            errorCode: () => 0,
            errorMessage: () => "",
            responseObject: () => ({ roles: user?.roles || [], message: { message: `Role "${role}" ajouté avec succès` } as ConfirmationMessage })
        });
    }      

    /**
     * Simulate removing a role from a user.
     * @param userId The user's ID.
     * @param role The role to remove.
     */
    static removeRoleFromUser(userId: number, role: string): Promise<APIResponse<{ roles: string[], message: ConfirmationMessage }>> {
        const user = this.usersRoles.find(user => user.id === userId);
        if (user) {
            user.roles = user.roles.filter(userRole => userRole !== role);
        }
        return Promise.resolve({
            isError: () => false,
            errorCode: () => 0,
            errorMessage: () => "",
            responseObject: () => ({ roles: user?.roles || [], message: {message: "Role " + role + " retiré avec succès" } as ConfirmationMessage })
        });
    }    
}
