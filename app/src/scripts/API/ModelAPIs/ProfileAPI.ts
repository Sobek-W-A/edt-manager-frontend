import {Profile, ProfileInCreate, ProfileInUpdate} from "../APITypes/Profiles.ts";
import APIResponse from "../Responses/APIResponse.ts";
import {api} from "../API.ts";
import {HTTPMethod} from "../Enums/HTTPMethod.ts";


/**
 * This class is responsible for handling all the requests related to the Profile endpoints.
 */
export default class ProfileAPI {

    // The path to the Profile endpoints.
    static PROFILE_URL: string = '/profile';

    /**
     * This method builds and sends the request to get all the profiles
     * @returns Promise<APIResponse<Profile[]>> A promise that resolves to the APIResponse containing the Profile array.
     */
    static getAllProfiles(): Promise<APIResponse<Profile[]>> {
        return api.requestLogged<Profile[]>(
            HTTPMethod.GET,
            `${ProfileAPI.PROFILE_URL}/`,
            undefined,
            undefined
        );
    }

    /**
     * This method returns the profile specified by the id provided.
     * @param profile_id The id of the profile to be returned.
     * @returns Promise<APIResponse<Profile>> A promise that resolves to the APIResponse containing the Profile.
     */
    static getProfileById(profile_id: number): Promise<APIResponse<Profile>> {
        return api.requestLogged<Profile>(
            HTTPMethod.GET,
            `${ProfileAPI.PROFILE_URL}/${profile_id}`,
            undefined,
            undefined
        );
    }

    /**
     * This method builds and sends the request to create a profile.
     * @param profile The profile to be created.
     * @returns Promise<APIResponse<undefined>> A promise that resolves to the APIResponse containing undefined.
     */
    static createProfile(profile: ProfileInCreate): Promise<APIResponse<undefined>> {
        return api.requestLogged<undefined>(
            HTTPMethod.POST,
            `${ProfileAPI.PROFILE_URL}/`,
            JSON.stringify(profile),
            undefined
        );
    }

    /**
     * This method builds and sends the request to update a profile.
     * @param profile_id The id of the profile to be updated.
     * @param profile The profile data.
     * @returns Promise<APIResponse<undefined>> A promise that resolves to the APIResponse containing undefined.
     */
    static updateProfile(profile_id: number, profile: ProfileInUpdate): Promise<APIResponse<undefined>> {
        return api.requestLogged<undefined>(
            HTTPMethod.PATCH,
            `${ProfileAPI.PROFILE_URL}/${profile_id}`,
            JSON.stringify(profile),
            undefined
        );
    }

    /**
     * This method builds and sends the request to delete a profile.
     * @param profile_id The id of the profile to be deleted.
     * @returns Promise<APIResponse<undefined>> A promise that resolves to the APIResponse containing undefined.
     */
    static deleteProfile(profile_id: number): Promise<APIResponse<undefined>> {
        return api.requestLogged<undefined>(
            HTTPMethod.DELETE,
            `${ProfileAPI.PROFILE_URL}/${profile_id}`,
            undefined,
            undefined
        );
    }

    /**
     * This method return all the profiles that have satisfied the search query.
     * @param query The query to search for.
     * @returns A promise that resolves to an array of profiles or an error.
     */
    static searchProfilesByKeywords(keywords: string): Promise<APIResponse<Profile[]>> {
        return api.requestLogged<Profile[]>(
            HTTPMethod.GET,
            `${ProfileAPI.PROFILE_URL}/search/${keywords}`,
            undefined,
            undefined
        );
    }
}