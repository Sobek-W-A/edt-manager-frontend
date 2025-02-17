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
  static AFFECTATION_URL = "/affectation";

  /**
   * Assign a course to a profile.
   */
  static assignCourseToProfile(affectation: AffectationInCreate): Promise<APIResponse<undefined>> {
    return api.requestLogged<undefined>(
      HTTPMethod.POST,
      `${AffectationAPI.AFFECTATION_URL}/assign`,
      JSON.stringify(affectation),
      undefined
    );
  }

  /**
   * Fetch the profile of the logged-in user.
   */
  static getProfile(): Promise<APIResponse<{ id: number; firstname: string; lastname: string; mail: string }>> {
    return api.requestLogged<{ id: number; firstname: string; lastname: string; mail: string }>(
      HTTPMethod.GET,
      `/profile/me`,
      undefined,
      undefined
    );
  }

  /**
   * Fetch teacher affectations.
   */
  static getTeacherAffectations(profile_id: number): Promise<APIResponse<AffectationType[]>> {
    return api.requestLogged<AffectationType[]>(
      HTTPMethod.GET,
      `${AffectationAPI.AFFECTATION_URL}/${profile_id}`,
      undefined,
      undefined
    );
  }

  /**
   * Fetch teacher affectations.
   */
  static getAffectationsByCourseId(course_id: number): Promise<APIResponse<AffectationType[]>> {
    console.log(`${AffectationAPI.AFFECTATION_URL}/course/${course_id}`)
    return api.requestLogged<AffectationType[]>(
        HTTPMethod.GET,
        `${AffectationAPI.AFFECTATION_URL}/course/${course_id}`,
        undefined,
        undefined
    );
  }

  /**
   * Fetch colleagues assigned to a specific course.
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
   * Fetch course details by course ID.
   */
  static getCourseById(course_id: number): Promise<APIResponse<{ course_type: { name: string } }>> {
    return api.requestLogged<{ course_type: { name: string } }>(
      HTTPMethod.GET,
      `/course/${course_id}`,
      undefined,
      undefined
    );
  }
}