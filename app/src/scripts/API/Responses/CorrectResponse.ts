import APIResponse from "./APIResponse.ts";

/**
 * This class inherits from APIResponse and represents a successful response from the API.
 * It contains the data returnd by the API as a type inference. Specify T to make it as you want it to be.
 */
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