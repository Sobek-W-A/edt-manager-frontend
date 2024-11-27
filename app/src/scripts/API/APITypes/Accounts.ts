export type Account = {
    id      : number;
    login   : string;
}

export type AccountInCreate = {
    login                : string;
    password             : string;
    password_confirmation: string;
}

export type AccountInUpdate = {
    login                : string | undefined;
    password             : string | undefined;
    password_confirmation: string | undefined;
}