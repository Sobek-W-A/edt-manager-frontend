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
        return api.requestLogged<UE>(
            HTTPMethod.GET,
            `${UEAPI.UE_PATH}/${id}`,
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
        return api.requestLogged<undefined>(
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
        return api.requestLogged<undefined>(
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
        return api.requestLogged<UE>(
            HTTPMethod.POST,
            `${UEAPI.UE_PATH}/`,
            JSON.stringify(ue),
            undefined
        );
    }
}