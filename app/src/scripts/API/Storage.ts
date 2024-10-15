export default class Storage {

    static setTokensInStorage(access_token: string, refresh_token: string):void {
        window.sessionStorage.setItem("access_token", access_token);
        window.sessionStorage.setItem("refresh_token", refresh_token);
    }

    static cleanStorage(): void{
        window.sessionStorage.clear();
    }

    static getAccessTokenFromStorage(): string {
        const token = window.sessionStorage.getItem("access_token");
        return token === null ? "" : token;
    }

    static getRefreshTokenFromStorage(): string {
        const token = window.sessionStorage.getItem("refresh_token");
        return token === null ? "" : token;
    }
}