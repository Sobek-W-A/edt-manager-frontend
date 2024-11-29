import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import APIResponse from "../Responses/APIResponse.ts";
import {StatusType} from "../APITypes/Statuses.ts";
import {api} from "../API.ts";

export default class StatusAPI {

    static BASE_STATUS_URL: string = '/status';

    /**
     * This method sends the request to get all the statuses.
     * @returns A promise that is either an array of StatusType or an error.
     */
    static getAllStatus(): Promise<APIResponse<StatusType[]>> {
        return api.requestLogged<StatusType[]>(
            HTTPMethod.GET,
            StatusAPI.BASE_STATUS_URL + "/",
            undefined
        );
    }

    /**
     * This method sends the request to get the status specified by the id provided.
     * @param status_id The id of the status to be returned.
     * @returns A promise that is either a StatusType or an error.
     */
    static getStatusById(status_id: number): Promise<APIResponse<StatusType>> {
        return api.requestLogged<StatusType>(
            HTTPMethod.GET,
            StatusAPI.BASE_STATUS_URL + `/${status_id}`,
            undefined
        );
    }
}