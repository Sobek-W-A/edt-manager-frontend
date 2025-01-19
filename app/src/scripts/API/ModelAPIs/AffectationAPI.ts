import APIResponse from "../Responses/APIResponse.ts";
import { HTTPMethod } from "../Enums/HTTPMethod.ts";
import { api } from "../API.ts";
import { AffectationInCreate } from "../APITypes/AffectationType.ts";

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
  static readonly PROFILE_PATH = "/affectation/profile";
  static readonly COURSE_PATH = "/affectation/course";
  static readonly AFFECTATION_URL = "/affectation";

  /**
   * Function to fetch the profile of the logged-in user.
   *
   * @returns A promise resolving to the user profile data or an error.
   */
  static getProfile(): Promise<APIResponse<{ id: number; firstname: string; lastname: string; mail: string }>> {
    return api.requestLogged<{ id: number; firstname: string; lastname: string; mail: string }>(
      HTTPMethod.GET,
      `/profile/4`,
      undefined,
      undefined
    );
  }

  /**
   * Function to fetch teacher affectations.
   *
   * @param profile_id The profile ID of the teacher to fetch affectations for.
   * @returns A promise resolving to an array of AffectationType or an error.
   */
  static getTeacherAffectations(profile_id: number): Promise<APIResponse<AffectationType[]>> {
    return api.requestLogged<AffectationType[]>(
      HTTPMethod.GET,
      `${AffectationAPI.PROFILE_PATH}/${profile_id}`,
      undefined,
      undefined
    );
  }

  /**
   * Function to fetch colleagues assigned to a specific course.
   *
   * @param course_id The ID of the course to fetch colleagues for.
   * @returns A promise resolving to an array of objects with firstname and lastname.
   */
  static getColleaguesByCourseId(course_id: number): Promise<APIResponse<{ firstname: string; lastname: string }[]>> {
    return api.requestLogged<{ firstname: string; lastname: string }[]>(
      HTTPMethod.GET,
      `${AffectationAPI.COURSE_PATH}/${course_id}`,
      undefined,
      undefined
    );
  }

  /**
   * Function to assign a course to a profile.
   *
   * @param affectation The affectation data to assign.
   * @returns A promise resolving to undefined or an error.
   */
  static assignCourseToProfile(affectation: AffectationInCreate): Promise<APIResponse<undefined>> {
    return api.requestLogged<undefined>(
      HTTPMethod.POST,
      `${AffectationAPI.AFFECTATION_URL}/assign`,
      JSON.stringify(affectation),
      undefined
    );
  }
}
