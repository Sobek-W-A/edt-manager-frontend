import APIResponse from "./APIResponse.ts";

export default class CorrectResponse<T> implements APIResponse<T> {

    private readonly _responseObject: T;

    constructor(responseObject: T) {
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
    responseObject(): T {
        return this._responseObject;
    }
}