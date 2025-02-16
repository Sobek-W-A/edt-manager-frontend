import { Course, CourseInCreation, CourseInUpdate } from "./Course";

export type UE = {
    id: string;
    name: string;
    courses: Course[];
    academic_year: number;
}

export type UEInCreation = {
    academic_year: number;
    name: string;
    parent_id: number;
    courses: CourseInCreation[];
}

export type UeInUpdate = {
    academic_year: number[] | undefined;
    name: string | undefined;
    courses: CourseInUpdate[] | undefined;
}