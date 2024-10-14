import APIResponse from "./APIResponse.ts";

export default class CorrectResponse implements APIResponse {

    private readonly _responseObject: unknown;

    constructor(responseObject: unknown) {
        this._responseObject = responseObject;
    }

    isError(): boolean {
        return false;
    }
    errorCode(): number {
        return -1;
    }
    errorMessage(): string {
        return ""
    }
    responseObject(): unknown {
        return this._responseObject;
    }
}