import { CourseType, CourseTypeInCreation, CourseTypeInUpdate } from "./CourseType";

export type Course = {
    academic_year: number[];
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
    academic_year: number[] | undefined;
    duration: number | undefined;
    courses_types: CourseTypeInUpdate[] | undefined;
}