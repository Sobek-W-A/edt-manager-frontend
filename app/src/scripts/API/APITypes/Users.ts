export type UserType = {
    id:         number;
    login:      string;
    firstname:  string;
    lastname:   string;
    mail:       string;
}

export type UserInPatchType = {
    login:                  string | undefined;
    firstname:              string | undefined;
    lastname:               string | undefined;
    mail:                   string | undefined;
    password:               string | undefined;
    password_confirmation:  string | undefined;
}