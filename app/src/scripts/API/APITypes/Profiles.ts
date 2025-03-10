export type Profile = {
    academic_year: number;
    id:         number;
    firstname:  string;
    lastname:   string;
    mail:       string;
    quota:      number;
    account_id: number | undefined;
    status_id:  number | undefined;
}

export type ProfileInCreate = {
    firstname:  string;
    lastname:   string;
    mail:       string;
    quota:      number;
    academic_year : number
    account_id: number | undefined;
    status_id:  number | undefined;
}

export type ProfileInUpdate = {
    id : number | undefined;
    firstname:  string | undefined;
    lastname:   string | undefined;
    mail:       string | undefined;
    quota:      number | undefined;
    academic_year : number
    account_id: number | undefined;
    status_id:  number | undefined;
}