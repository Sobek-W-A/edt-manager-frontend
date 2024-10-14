import APIResponse from "./APIResponse.ts";

export default class ErrorResponse implements APIResponse {

    public readonly _errorCode  : number;
    public readonly _errorMessage: string;

    constructor(errorCode: number, errorMessage: string) {
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

    responseObject(): unknown {
        return undefined;
    }
}