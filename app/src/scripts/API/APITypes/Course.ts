import { CourseType, CourseTypeInCreation } from "./CourseType";

export type Course = {
    academic_year: number;
    id:	number;
    duration: number;
    course_type: CourseType;
    group_count: number;
}

export type CourseInCreation = {
    academic_year: number[];
    course_id: number;
    duration: number;
    courses_types: CourseTypeInCreation[];
}

export type CourseInUpdate = {
    academic_year: number[];
    id:	number;
    duration: number;
    course_type: CourseType;
    group_count: number;
}