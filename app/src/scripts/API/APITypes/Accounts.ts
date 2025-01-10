import { Profile } from './Profiles';

export type Account = {
    id      : number;
    login   : string;
    profile : Profile;
}

export type AccountInCreate = {
    login            : string;
    password         : string;
    password_confirm : string;
}

export type AccountInUpdate = {
    login            : string | undefined;
    password         : string | undefined;
    password_confirm : string | undefined;
}