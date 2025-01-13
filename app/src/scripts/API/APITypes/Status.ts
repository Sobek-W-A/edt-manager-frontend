export type StatusType = {
    id            : number;
    name          : string;
    description   : string;
    academic_year : number;
    quota         : number
}

export type StatusTypeInCreation = {
    name          : string;
    description   : string;
    academic_year : number;
    quota         : number
}

export type StatusTypeInUpdate = {
    name          : string | undefined;
    description   : string | undefined;
    academic_year : number | undefined;
    quota         : number | undefined
}