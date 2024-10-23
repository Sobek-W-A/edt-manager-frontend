import APIResponse from "./APIResponse.ts";

/**
 * This class inherits from APIResponse and represents an unsuccessful response from the API.
 * It can be used to diagnose the reason for the request's failure.
 */
export default class ErrorResponse<T> extends APIResponse<T> {

    public readonly _errorCode  : number;
    public readonly _errorMessage: string;

    constructor(errorCode: number, errorMessage: string) {
        super();
        this._errorCode    = errorCode;
        this._errorMessage = errorMessage;
    }

    isError(): boolean {
        return true;
    }
    errorCode(): number {
        return this._errorCode;
    }
    errorMessage(): string {
        return this._errorMessage;
    }
    responseObject(): T {
        return {} as T;
    }
}