import {Course} from "./Course.ts";

export type UE = {
    academic_year: number;
    courses: Course[];
    id: string;
    name: string;
}

