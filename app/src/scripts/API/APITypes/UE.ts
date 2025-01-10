import { Course, CourseInCreation, CourseInUpdate } from "./Course";

export type UE = {
    academic_year: number[];
    ue_id: number;
    name: string;
    courses: Course[];
}

export type UEInCreation = {
    academic_year: number[];
    name: string;
    parent_id: number;
    courses: CourseInCreation[];
}

export type UeInUpdate = {
    academic_year: number[] | undefined;
    name: string | undefined;
    courses: CourseInUpdate[] | undefined;
}