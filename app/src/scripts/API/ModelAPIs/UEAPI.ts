import {api} from "../API.ts";
import {UE} from "../APITypes/UETypes.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import APIResponse from "../Responses/APIResponse.ts";
import CorrectResponse from "../Responses/CorrectResponse.ts";

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

        const mockBody = {
            "academic_year": 2025,
            "ue_id": 2,
            "name": "UE 2",
            "courses": [
                {
                    "academic_year": 2025,
                    "id": 6,
                    "duration": 28,
                    "group_count": 1,
                    "course_type": [
                        {
                            "academic_year": 2025,
                            "course_type_id": 1,
                            "name": "CM",
                            "description": "Cours Magistral"
                        }
                    ]
                },
                {
                    "academic_year": 2024,
                    "id": 7,
                    "duration": 60,
                    "group_count": 1,
                    "course_type": [
                        {
                            "academic_year": 2025,
                            "course_type_id": 2,
                            "name": "TD",
                            "description": "Travaux Dirigés"
                        }
                    ]
                },
                {
                    "academic_year": 2025,
                    "id": 8,
                    "duration": 30,
                    "group_count": 1,
                    "course_type": [
                        {
                            "academic_year": 2025,
                            "course_type_id": 3,
                            "name": "TP",
                            "description": "Travaux Pratiques"
                        }
                    ]
                },
                {
                    "academic_year": 2024,
                    "id": 9,
                    "duration": 52,
                    "group_count": 1,
                    "course_type": [
                        {
                            "academic_year": 2025,
                            "course_type_id": 4,
                            "name": "EI",
                            "description": "Enseignement d'Intégration"
                        }
                    ]
                },
                {
                    "academic_year": 2025,
                    "id": 10,
                    "duration": 20,
                    "group_count": 1,
                    "course_type": [
                        {
                            "academic_year": 2025,
                            "course_type_id": 5,
                            "name": "TPL",
                            "description": "Travaux Pratiques Libres"
                        }
                    ]
                }
            ]
        };

        return new Promise((resolve) => {
            // @ts-ignore
            resolve(new CorrectResponse(mockBody));
        });

        /**return api.requestLogged<UE>(
            HTTPMethod.GET,
            `${UEAPI.UE_PATH}/${id}`,
            undefined,
            undefined
        );**/
    }

}