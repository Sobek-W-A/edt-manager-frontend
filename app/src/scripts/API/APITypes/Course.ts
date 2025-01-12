import {CourseType} from "./CourseType.ts";

export type Course = {
    academic_year: number;
    id: number;
    duration : number;
    courses_types: CourseType;
}

