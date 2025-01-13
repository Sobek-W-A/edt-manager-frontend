import APIResponse from "../Responses/APIResponse.ts";
import { HTTPMethod } from "../Enums/HTTPMethod.ts";
import { api } from "../API.ts";

/**
 * TypeScript interface pour typer une affectation.
 */
export interface AffectationType {
  id: number;
  profile_id: number;
  course_id: number;
  hours: number;
  notes: string;
  date: string;
  group: number;
}

/**
 * API methods for affectation endpoints.
 */
export default class AffectationAPI {
  static PROFILE_PATH = "/affectation/profile";

  /**
   * Function to fetch teacher affectations.
   *
   * @param profile_id The profile ID of the teacher to fetch affectations for (default: 3).
   * @returns A promise resolving to an array of AffectationType or an error.
   */
  static getTeacherAffectations(profile_id: number = 3): Promise<APIResponse<AffectationType[]>> {
    return api.requestLogged<AffectationType[]>(
      HTTPMethod.GET,
      `${AffectationAPI.PROFILE_PATH}/${profile_id}`,
      undefined,
      undefined
    );
  }

  /**
   * Function to fetch a specific affectation by ID.
   *
   * @param affectation_id The ID of the affectation to fetch.
   * @returns A promise resolving to an AffectationType or an error.
   */
  static getAffectationById(affectation_id: number): Promise<APIResponse<AffectationType>> {
    return api.requestLogged<AffectationType>(
      HTTPMethod.GET,
      `/affectation/${affectation_id}`,
      undefined,
      undefined
    );
  }
}
