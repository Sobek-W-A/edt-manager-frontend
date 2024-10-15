/* Simple confirmation message from the API. */
export type ConfirmationMessage = {
    message: string;
}

/* A simple superset of the errors returned by the api. Mainly used to make linter happy. */
export type APIErrorResponse = {
    [key: string]: string;
}