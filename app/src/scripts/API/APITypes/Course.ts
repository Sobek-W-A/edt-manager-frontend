import { CourseType, CourseTypeInCreation, CourseTypeInUpdate } from "./CourseType";

export type Course = {
    academic_year: number[];
    course_id:	number;	
    duration: number;
    courses_typeS: CourseType[];
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