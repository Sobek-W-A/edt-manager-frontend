export type Profile = {
    id:         number;
    firstname:  string;
    lastname:   string;
    email:      string;
    account_id: number | undefined;
    status_id:  number | undefined;
}


export type ProfileInCreate = {
    firstname:  string;
    lastname:   string;
    email:      string;
    account_id: number | undefined;
    status_id:  number | undefined;
}

export type ProfileInUpdate = {
    firstname:  string | undefined;
    lastname:   string | undefined;
    email:      string | undefined;
    account_id: number | undefined;
    status_id:  number | undefined;
}