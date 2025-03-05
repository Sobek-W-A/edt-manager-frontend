import Storage from "../API/Storage.ts";
import { TokenPair } from "../API/APITypes/Tokens.ts";
import CorrectResponse from "../API/Responses/CorrectResponse.ts";
import AuthAPI from "../API/ModelAPIs/AuthAPI.ts";
import APIResponse from "../API/Responses/APIResponse.ts";

/**
 * Interface for the role response from the API
 */
interface RoleResponse {
    name: string;
    description: string;
    permissions: string[];
}

/**
 * This class provides handling methods for the authentication process of the user.
 */
export default class AuthModel {
    private readonly _login: string;
    private readonly _password: string;
    static BASE_LOGIN_URL: string = '/login';

    constructor(login: string, password: string) {
        this._login = login;
        this._password = password;
    }

    /**
     * Checks if the user is logged in.
     * @returns A boolean indicating if the user is logged in.
     */
    static isLoggedIn(): boolean {
        return Storage.isAccessTokenStored();
    }

    /**
     * Authenticates the user and fetches their role.
     * @returns A promise resolving to a token pair or an error.
     */
    async login(): Promise<APIResponse<TokenPair>> {
        const res: APIResponse<TokenPair> = await AuthAPI.loginRequest(this._login, this._password);
        if (!res.isError()) {
            const tokens = (res as CorrectResponse<TokenPair>).responseObject();
            Storage.setTokensInStorage(tokens.access_token, tokens.refresh_token);
            // Fetch and store the role after successful login
            await this.fetchAndStoreRole(tokens.access_token);
        }
        return res;
    }

    /**
     * Fetches the user’s role from the API and stores it in sessionStorage.
     * @param accessToken The access token to authenticate the API request.
     */
    private async fetchAndStoreRole(accessToken: string): Promise<void> {
        try {
            const response = await fetch('http://localhost:8000/account/me/role?academic_year=2024', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch role');
            }

            const roleData: RoleResponse = await response.json();
            window.sessionStorage.setItem('userRole', roleData.name);
        } catch (error) {
            console.error('Error fetching role:', error);
            // Optionally, handle the error (e.g., log out the user)
        }
    }

    /**
     * Disconnects the user and cleans up storage.
     * @returns A promise that resolves when logout is complete.
     */
    static async logout(): Promise<void> {
        await AuthAPI.logoutRequest(
            Storage.getAccessTokenFromStorage(),
            Storage.getRefreshTokenFromStorage()
        );
        Storage.cleanStorage();
        window.location.href = AuthModel.BASE_LOGIN_URL;
    }

    /**
     * Refreshes the tokens and updates storage.
     * @returns A promise that resolves when tokens are refreshed.
     */
    static async refreshTokens(): Promise<void> {
        const response = await AuthAPI.refreshTokensRequest(
            Storage.getRefreshTokenFromStorage()
        );
        if (response.isError()) {
            Storage.cleanStorage();
            window.location.reload();
        } else {
            const tokens = (response as CorrectResponse<TokenPair>).responseObject();
            Storage.setTokensInStorage(tokens.access_token, tokens.refresh_token);
        }
    }

    /**
     * Retrieves the user’s role from sessionStorage.
     * @returns The user’s role as a string, or an empty string if not set.
     */
    static getRole(): string {
        return window.sessionStorage.getItem('userRole') || '';
    }
}