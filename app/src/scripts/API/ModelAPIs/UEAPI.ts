import {api} from "../API.ts";
import {UE} from "../APITypes/UETypes.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import APIResponse from "../Responses/APIResponse.ts";

export default class UEAPI {

    static UE_PATH = "/ue";

    /**
     * This method builds and sends the request to get all the UEs.
     * @returns The response of the request.
     */
    static async getAllUEs(): Promise<APIResponse<UE[]>> {
        return api.requestLogged<UE[]>(
            HTTPMethod.GET,
            `${UEAPI.UE_PATH}/`,
            undefined,
            undefined
        );
    }

    /**
     * This method builds and sends the request to get a UE by its id.
     * @param id The id of the UE to get.
     * @returns The response of the request.
     */
    static async getUEById(id: string): Promise<APIResponse<UE>> {
        return api.requestLogged<UE>(
            HTTPMethod.GET,
            `${UEAPI.UE_PATH}/${id}`,
            undefined,
            undefined
        );
    }

}