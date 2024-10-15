import APIResponse from "./APIResponse.ts";

export default class CorrectResponse implements APIResponse {

    private readonly _responseObject: object;

    constructor(responseObject: object) {
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
    responseObject(): object {
        return this._responseObject;
    }
}