/**
 * This interface provides methods that needs to be implemented for
 * all classes that are used to characterize the API's responses.
 * It uses the type inference for any data returned by the API.
 */
export default abstract class APIResponse<T> {

    protected constructor() {}

    /**
     * This method checks if the current subclass is an error or not.
     */
    abstract isError(): boolean;

    /**
     * This method returns the error code specified in the API's answer if it's an error. -1 otherwise.
     */
    abstract errorCode(): number;

    /**
     * This method returns the message provided by the api if it's an error. Returns an empty string otherwise.
     */
    abstract errorMessage(): string;

    /**
     * Returns the data provided as response by the api if the request was successful. Returns an empty object otherwise.
     */
    abstract responseObject(): T;
}