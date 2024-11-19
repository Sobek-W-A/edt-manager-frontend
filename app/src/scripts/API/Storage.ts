/**
 * This class provides methods for handling token storage inside the web browser for later use.
 */
export default class Storage {

    /**
     * This method stores the token pair inside the session storage.
     * @param access_token Access token to store.
     * @param refresh_token Refresh token to store.
     */
    static setTokensInStorage(access_token: string, refresh_token: string): void {
        window.sessionStorage.setItem("access_token", access_token);
        window.sessionStorage.setItem("refresh_token", refresh_token);
    }

    /**
     * This method cleans all the data stored inside the sessions storage.
     */
    static cleanStorage(): void {
        window.sessionStorage.clear();
    }

    /**
     * This method fetches the access token from the session storage.
     * If said token is not stored when accessing, it returns an empty string.
     */
    static getAccessTokenFromStorage(): string {
        const token = window.sessionStorage.getItem("access_token");
        return token === null ? "" : token;
    }

    /**
     * This method fetches the refresh token from the session storage.
     * If said token is not stored when accessing, it returns an empty string.
     */
    static getRefreshTokenFromStorage(): string {
        const token = window.sessionStorage.getItem("refresh_token");
        return token === null ? "" : token;
    }
}