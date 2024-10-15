export default interface APIResponse {
    isError(): boolean;
    errorCode(): number;
    errorMessage(): string;
    responseObject(): object;
}