import {api} from "../API.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import APIResponse from "../Responses/APIResponse.ts";
import {UserInPatchType, UserType} from "../APITypes/Users.ts";

/**
 * API methods for user endpoints.
 */
export default class UserAPI {

    static BASE_USER_URL: string = '/user';

    /**
     * This method sends the request to get personal information about the connected user.
     * @returns A promise that is either a User or an error.
     */
    static getCurrentUser(): Promise<APIResponse<UserType>> {
        return api.requestLogged<UserType>(
            HTTPMethod.GET,
            UserAPI.BASE_USER_URL + "/me",
            undefined
        );
    }

    /**
     * This method sends the request to get personal information about the users registered in the API.
     * @returns A promise that is either an array of User or an error.
     */
    static getUserByID(user_id: number): Promise<APIResponse<UserType>> {
        return api.requestLogged<UserType>(
            HTTPMethod.GET,
            UserAPI.BASE_USER_URL + `/${user_id}`,
            undefined
        );
    }

    /**
     * This method sends the request to get personal information about the users registered in the API.
     * @returns A promise that is either an array of User or an error.
     */
    static getAllUsers(): Promise<APIResponse<UserType[]>> {
        return api.requestLogged<UserType[]>(
            HTTPMethod.GET,
            UserAPI.BASE_USER_URL + "/all",
            undefined
        );
    }

    /**
     * This method updates the user qualified by the id provided using the information of the body.
     * @param user_id User id to qualify the user to modify.
     * @param body    Body containing the new information of the user.
     */
    static updateUser(user_id: number, body: UserInPatchType): Promise<APIResponse<undefined>> {
        return api.requestLogged<undefined>(
            HTTPMethod.PATCH,
            UserAPI.BASE_USER_URL + `/${user_id}`,
            JSON.stringify(body)
        );
    }
}
