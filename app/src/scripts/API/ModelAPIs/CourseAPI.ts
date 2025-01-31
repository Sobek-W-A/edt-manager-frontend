import {api} from "../API.ts";
import {Course, CourseInCreation, CourseInUpdate} from "../APITypes/Course.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";
import APIResponse from "../Responses/APIResponse.ts";

export default class CourseAPI {

    static COURSE_PATH = "/course";

    /**
     * This method builds and sends the request to get a course by its id.
     * @param id The id of the course to get.
     * @returns The response of the request.
     */
    static async getCourseById(id: number): Promise<APIResponse<Course>> {
        return api.requestLogged<Course>(
            HTTPMethod.GET,
            `${CourseAPI.COURSE_PATH}/${id}`,
            undefined,
            undefined
        );
    }

    /**
     * This method is used to modify a Course.
     * @param id The id of the Course to modify.
     * @param course The new values of the Course.
     * @returns The response of the request.
     */
    static async modifyCourse(id: number, course: CourseInUpdate): Promise<APIResponse<undefined>> {
        return api.requestLogged<undefined>(
            HTTPMethod.PATCH,
            `${CourseAPI.COURSE_PATH}/${id}`,
            JSON.stringify(course),
            undefined
        );
    }

    /**
     * This method is used to delete a Course.
     * @param id The id of the Course to delete.
     * @returns The response of the request.
     */
    static async deleteCourse(id: number): Promise<APIResponse<undefined>> {
        return api.requestLogged<undefined>(
            HTTPMethod.DELETE,
            `${CourseAPI.COURSE_PATH}/${id}`,
            undefined,
            undefined
        );
    }

    /**
     * This method is used to create a new Course.
     * @param course The new Course.
     * @returns The response of the request.
     */
    static async createCourse(course: CourseInCreation): Promise<APIResponse<Course>> {
        return api.requestLogged<Course>(
            HTTPMethod.POST,
            `${CourseAPI.COURSE_PATH}/`,
            JSON.stringify(course),
            undefined
        );
    }
}