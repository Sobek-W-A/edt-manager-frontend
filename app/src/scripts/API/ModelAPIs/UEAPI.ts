import {api} from "../API.ts";
import {UE, UEInCreation, UeInUpdate} from "../APITypes/UE.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import APIResponse from "../Responses/APIResponse.ts";

export default class UEAPI {

    static UE_PATH = "/ue";

    /**
     * This method builds and sends the request to get a UE by its id.
     * @param id The id of the UE to get.
     * @returns The response of the request.
     */
    static async getUEById(id: number): Promise<APIResponse<UE>> {
        return api.requestLoggedWithAcademicYear<UE>(
            HTTPMethod.GET,
            `${UEAPI.UE_PATH}/${id}`,
            undefined,
            undefined
        );
    }

    /**
     * This method is used to get all UEs of a specific profile.
     * @param profileId The id of the profile to get the UEs from.
     * @returns The response of the request.
     */
    static async getUEsByProfileId(profileId: number): Promise<APIResponse<UE[]>> {
        return api.requestLoggedWithAcademicYear<UE[]>(
            HTTPMethod.GET,
            `${UEAPI.UE_PATH}/affectedto/${profileId}`,
            undefined,
            undefined
        );
    }


    /**
     * This method is used to modify a UE.
     * @param id The id of the UE to modify.
     * @param ue The new values of the UE.
     * @returns The response of the request.
     */
    static async modifyUE(id: number, ue: UeInUpdate): Promise<APIResponse<undefined>> {
        return api.requestLoggedWithAcademicYear<undefined>(
            HTTPMethod.PATCH,
            `${UEAPI.UE_PATH}/${id}`,
            JSON.stringify(ue),
            undefined
        );
    }

    /**
     * This method is used to delete a UE.
     */
    static async deleteUE(id: number): Promise<APIResponse<undefined>> {
        return api.requestLoggedWithAcademicYear<undefined>(
            HTTPMethod.DELETE,
            `${UEAPI.UE_PATH}/${id}`,
            undefined,
            undefined
        );
    }

    /**
     * This method is used to create a new UE.
     * @param ue The new UE.
     * @returns The response of the request.
     */
    static async createUE(ue: UEInCreation): Promise<APIResponse<UE>> {
        return api.requestLoggedWithAcademicYear<UE>(
            HTTPMethod.POST,
            `${UEAPI.UE_PATH}/`,
            JSON.stringify(ue),
            undefined
        );
    }

    /**
     * This method attaches the UE to the parent node.
     * @param ueId The id of the UE to attach.
     * @param nodeId The id of the Node to which the UE will be attached.
     * @returns The response of the request.
     */
    static async attachUEToNode(ueId: number, nodeId: number): Promise<APIResponse<string>> {
        return api.requestLoggedWithAcademicYear<string>(
            HTTPMethod.POST,
            `${UEAPI.UE_PATH}/attach/${ueId}/${nodeId}`,
            undefined,
            undefined
        );
    }

    /**
     * This method detaches the UE from the parent node.
     * @param ueId The id of the UE to detach.
     * @param nodeId The id of the Node from which the UE will be detached.
     * @returns The response of the request.
     */
    static async detachUEFromNode(ueId: number, nodeId: number): Promise<APIResponse<string>> {
        return api.requestLoggedWithAcademicYear<string>(
            HTTPMethod.POST,
            `${UEAPI.UE_PATH}/detach/${ueId}/${nodeId}`,
            undefined,
            undefined
        );
    }
}