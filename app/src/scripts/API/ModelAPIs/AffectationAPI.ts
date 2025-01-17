import APIResponse from "../Responses/APIResponse.ts";
import {api} from "../API.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import {AffectationInCreate} from "../APITypes/AffectationType.ts";


export default class AffectationAPI {

    static AFFECTATION_URL = "/affectation";

    static assignCourseToProfile(affectation: AffectationInCreate): Promise<APIResponse<undefined>> {
        return api.requestLogged<undefined>(
            HTTPMethod.POST,
            `${AffectationAPI.AFFECTATION_URL}/assign`,
            JSON.stringify(affectation),
            undefined
        )
    }
}