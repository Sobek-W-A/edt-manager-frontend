export default class Storage {

    static setTokensInStorage(access_token: string, refresh_token: string){
        window.sessionStorage.setItem("access_token", access_token);
        window.sessionStorage.setItem("refresh_token", refresh_token);
    }

    static cleanStorage(){
        window.sessionStorage.clear();
    }

    static getAccessTokenFromStorage() {
        return window.sessionStorage.getItem("access_token");
    }

    static getRefreshTokenFromStorage() {
        return window.sessionStorage.getItem("refresh_token");
    }
}