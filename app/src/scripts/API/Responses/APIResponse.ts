export default interface APIResponse<T> {
    isError(): boolean;
    errorCode(): number;
    errorMessage(): string;
    responseObject(): T;
}