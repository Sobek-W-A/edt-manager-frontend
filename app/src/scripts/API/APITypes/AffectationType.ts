import { Course } from "./Course";
import { Profile } from "./Profiles";

export type Affectation = {
    id: number,
    profile: number,
    course: Course,
    hours: number,
    notes: string,
    date: string,
    group: number,
}

export type AffectationInCreate = {
    course_id?: number,
    profile_id: number,
    hours: number,
    group: number,
    notes: string
}