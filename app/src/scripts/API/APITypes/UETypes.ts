import {Course} from "./Course.ts";

export type UE = {
    id: string;
    name: string;
    courses: Course[];
    academic_year: number;
}

