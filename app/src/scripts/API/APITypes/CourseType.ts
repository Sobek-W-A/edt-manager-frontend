export type CourseType = {
    academic_year: number[];
    course_type_id:	number;	
    name: string;
    description: string;
}

export type CourseTypeInCreation = {
    academic_year: number[];
    name: string;
    description: string;
}

export type CourseTypeInUpdate = {
    academic_year: number[] | undefined;
    name: string | undefined;
    description: string | undefined;
}