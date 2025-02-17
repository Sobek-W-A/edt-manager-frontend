import {ErrorResponse} from "react-router";
import AffectationAPI, {AffectationType} from "../API/ModelAPIs/AffectationAPI.ts";

export default class AffectationModel {
    constructor(affectationTypes: AffectationType[]) {
        
    }


    /**
     * This method gets a ProfileModel based on the profile_id provided.
     * @param profile_id The id of the profile to be returned.
     * @returns A promise that resolves into a ProfileModel or an ErrorResponse.
     */
    static async getAffectationByCourseId(course_id: number): Promise<AffectationModel | ErrorResponse> {
        const response = await AffectationAPI.getAffectationsByCourseId(course_id);
        if (response.isError()) return response as unknown as ErrorResponse;
        return new AffectationModel(response.responseObject());
    }

}