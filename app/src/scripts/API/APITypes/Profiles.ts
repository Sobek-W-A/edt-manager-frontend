export type Profile = {
    id:         number;
    firstname:  string;
    lastname:   string;
    mail:       string;
    account_id: number | undefined;
    status_id:  string | undefined;
}

export type ProfileInCreate = {
    firstname:  string;
    lastname:   string;
    mail:       string;
    account_id: number | undefined;
    status_id:  string | undefined;
}

export type ProfileInUpdate = {
    firstname:  string | undefined;
    lastname:   string | undefined;
    mail:       string | undefined;
    account_id: number | undefined;
    status_id:  string | undefined;
}