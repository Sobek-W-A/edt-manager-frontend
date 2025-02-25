import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import APIResponse from "../Responses/APIResponse.ts";
import {StatusType, StatusTypeInCreation, StatusTypeInUpdate} from "../APITypes/Status.ts";
import {api} from "../API.ts";

export default class StatusAPI {

    static BASE_STATUS_URL: string = '/status';

    /**
     * This method sends the request to get the status specified by the id provided.
     * @param status_id The id of the status to be returned.
     * @returns A promise that is either a StatusType or an error.
     */
    static getStatusById(status_id: number): Promise<APIResponse<StatusType>> {
        return api.requestLoggedWithAcademicYear<StatusType>(
            HTTPMethod.GET,
            StatusAPI.BASE_STATUS_URL + `/${status_id}`,
            undefined,
            undefined
        );
    }

    /**
     * This method sends the request to get the status specified by the id provided.
     * @param academic_year The id of the academic_year to be returned.
     * @returns A promise that is either a StatusType or an error.
     */
    static getStatusByAcademicYear(): Promise<APIResponse<StatusType[]>> {
        return api.requestLoggedWithAcademicYear<StatusType[]>(
            HTTPMethod.GET,
            StatusAPI.BASE_STATUS_URL + `/`,
            undefined,
            undefined
        );
    }

    /**
     * This method sends the request to modify the status specified by the id provided.
     * @param status_id The id of the status to be modified.
     * @param status The new values of the status.
     * @returns A promise that is either undefined or an error.
     */
    static modifyStatus(status_id: number, status: StatusTypeInUpdate): Promise<APIResponse<undefined>> {
        return api.requestLoggedWithAcademicYear<undefined>(
            HTTPMethod.PATCH,
            StatusAPI.BASE_STATUS_URL + `/${status_id}`,
            JSON.stringify(status),
            undefined
        );
    }

    /**
     * This method sends the request to delete the status specified by the id provided.
     * @param status_id The id of the status to be deleted.
     * @returns A promise that is either undefined or an error.
     */
    static deleteStatus(status_id: number): Promise<APIResponse<undefined>> {
        return api.requestLoggedWithAcademicYear<undefined>(
            HTTPMethod.DELETE,
            StatusAPI.BASE_STATUS_URL + `/${status_id}`,
            undefined,
            undefined
        );
    }

    /**
     * This method sends the request to create a new status.
     * @param status The new status.
     * @returns A promise that is either a StatusType or an error.
     */
    static createStatus(status: StatusTypeInCreation): Promise<APIResponse<StatusType>> {
        return api.requestLoggedWithAcademicYear<StatusType>(
            HTTPMethod.POST,
            StatusAPI.BASE_STATUS_URL + '/',
            JSON.stringify(status),
            undefined
        );
    }
}
