import APIResponse from "../Responses/APIResponse.ts";
import {AcademicYearType} from "../APITypes/AcademicYearType.ts";
import {api} from "../API.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";

export default class AcademicYearAPI {
    static ACADEMIC_YEAR_URL = "/academic_year";

    static getAllAcademicYear(): Promise<APIResponse<AcademicYearType[]>> {
        return api.requestLogged<AcademicYearType[]>(
            HTTPMethod.GET,
            `${this.ACADEMIC_YEAR_URL}`,
            undefined,
            undefined
        )
    }

    static createNextAcademicYear(): Promise<APIResponse<undefined>> {
        return api.requestLoggedWithAcademicYear<undefined>(
            HTTPMethod.POST,
            `${this.ACADEMIC_YEAR_URL}`,
            undefined,
            undefined
        )
    }
}
