import APIResponse from "../Responses/APIResponse.ts";
import { HTTPMethod } from "../Enums/HTTPMethod.ts";
import { api } from "../API.ts";
import {
  AffectationInCreate,
  Affectation,
} from "../APITypes/AffectationType.ts";

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
  static assignCourseToProfile(
    affectation: AffectationInCreate
  ): Promise<APIResponse<undefined>> {
    return api.requestLoggedWithAcademicYear<undefined>(
      HTTPMethod.POST,
      `${AffectationAPI.AFFECTATION_URL}/assign`,
      JSON.stringify(affectation),
      undefined
    );
  }

  /**
   * Fetch the profile of the logged-in user.
   */
  // AffectationAPI.ts
  static getProfile(): Promise<
    APIResponse<{
      id: number;
      firstname: string;
      lastname: string;
      mail: string;
      status_id?: number;
    }>
  > {
    return api.requestLoggedWithAcademicYear<{
      id: number;
      firstname: string;
      lastname: string;
      mail: string;
      status_id?: number;
    }>(HTTPMethod.GET, `/profile/me`, undefined, undefined);
  }

  /**
   * Fetch teacher affectations.
   */
  static getTeacherAffectations(
    profile_id: number
  ): Promise<APIResponse<AffectationType[]>> {
    return api.requestLoggedWithAcademicYear<AffectationType[]>(
      HTTPMethod.GET,
      `${AffectationAPI.PROFILE_PATH}/${profile_id}`,
      undefined,
      undefined
    );
  }

  /**
   * Fetch teacher affectations.
   */
  static getTeacherAffectationsByProfileId(
    profile_id: number
  ): Promise<APIResponse<Affectation[]>> {
    return api.requestLoggedWithAcademicYear<Affectation[]>(
      HTTPMethod.GET,
      `${AffectationAPI.PROFILE_PATH}/${profile_id}`,
      undefined,
      undefined
    );
  }

  /**
   * Fetch teacher affectations.
   */
  static getAffectationsByCourseId(
    course_id: number
  ): Promise<APIResponse<AffectationType[]>> {
    return api.requestLoggedWithAcademicYear<AffectationType[]>(
      HTTPMethod.GET,
      `${AffectationAPI.AFFECTATION_URL}/course/${course_id}`,
      undefined,
      undefined
    );
  }

  /**
   * Fetch colleagues assigned to a specific course.
   */
  static getColleaguesByCourseId(
    course_id: number
  ): Promise<APIResponse<{ firstname: string; lastname: string }[]>> {
    return api.requestLoggedWithAcademicYear<
      { firstname: string; lastname: string }[]
    >(
      HTTPMethod.GET,
      `${AffectationAPI.COURSE_PATH}/${course_id}`,
      undefined,
      undefined
    );
  }

  /**
   * delete affectation
   */
  static deleteAffectationById(
    affectation_id: number
  ): Promise<APIResponse<AffectationType[]>> {
    return api.requestLoggedWithAcademicYear<AffectationType[]>(
      HTTPMethod.DELETE,
      `${AffectationAPI.AFFECTATION_URL}/unassign/${affectation_id}`,
      undefined,
      undefined
    );
  }

  /**
   * Fetch course details by course ID.
   */
  static getCourseById(
    course_id: number
  ): Promise<APIResponse<{ course_type: { name: string } }>> {
    return api.requestLoggedWithAcademicYear<{ course_type: { name: string } }>(
      HTTPMethod.GET,
      `/course/${course_id}`,
      undefined,
      undefined
    );
  }

  static async updateAffectationById(body: {
    affectation_id: number;
    profile_id: number;
    course_id: number;
    hours: number;
    notes: string;
    group: number;
  }) {
    return api.requestLoggedWithAcademicYear<undefined>(
      HTTPMethod.PATCH,
      `${AffectationAPI.AFFECTATION_URL}/${body.affectation_id}`,
      JSON.stringify(body),
      undefined
    );
  }
}
