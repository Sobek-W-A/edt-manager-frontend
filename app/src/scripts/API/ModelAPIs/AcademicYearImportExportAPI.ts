import { api } from "../API.ts";
import { HTTPMethod } from "../Enums/HTTPMethod.ts";
import APIResponse from "../Responses/APIResponse.ts";

export default class AcademicYearImportExportAPI {
    static ACADEMIC_YEAR_PATH = "/academic-year";

    static async exportAcademicYear(year: number): Promise<APIResponse<Blob>> {
        return api.requestLoggedWithAcademicYear<Blob>(
            HTTPMethod.GET,
            `${this.ACADEMIC_YEAR_PATH}/${year}/export`,
            undefined,
            undefined
        );
    }

    static async importAcademicYear(file: File): Promise<APIResponse<void>> {
        const formData = new FormData();
        formData.append('file', file);

        return api.requestLoggedWithAcademicYear<void>(
            HTTPMethod.POST,
            `${this.ACADEMIC_YEAR_PATH}/import`,
            formData,
            undefined
        );
    }
} 