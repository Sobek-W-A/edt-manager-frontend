import {UE, UeInUpdate} from "../API/APITypes/UE.ts";
import ErrorResponse from "../API/Responses/ErrorResponse.ts";
import UEAPI from "../API/ModelAPIs/UEAPI.ts";
import {Course, CourseInUpdate} from "../API/APITypes/Course.ts";
import CourseAPI from "../API/ModelAPIs/CourseAPI.ts";
import {CourseType} from "../API/APITypes/CourseType.ts";

export default class CourseModel {


    private _academic_year: number;
    private _id:	number;
    private _duration: number;
    private _course_type: CourseType;
    private _group_count: number;

    constructor(course : Course) {
        this._id = course.id
        this._academic_year = course.academic_year
        this._duration = course.duration
        this._course_type = course.course_type
        this._group_count = course.group_count
    }


    static async modifyCourseById(course_id: number, new_course: Course): Promise<ErrorResponse<undefined> | undefined> {

        const response = await CourseAPI.modifyCourse(course_id, new_course);
        if (response.isError()) return response as ErrorResponse<undefined>;

    }

    get academic_year(): number {
        return this._academic_year;
    }

    get id(): number {
        return this._id;
    }

    get duration(): number {
        return this._duration;
    }

    get course_type(): CourseType {
        return this._course_type;
    }

    get group_count(): number {
        return this._group_count;
    }



}