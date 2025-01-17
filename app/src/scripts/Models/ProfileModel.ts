import {Profile, ProfileInCreate, ProfileInUpdate} from "../API/APITypes/Profiles.ts";
import ProfileAPI from "../API/ModelAPIs/ProfileAPI.ts";
import ErrorResponse from "../API/Responses/ErrorResponse.ts";

export default class ProfileModel {

    private _id        : number;
    private _academic_year : number;
    private _firstname : string;
    private _lastname  : string;
    private _mail      : string;
    private _account_id: number | undefined;
    private _status_id : string | undefined;

    constructor(profile: Profile) {
        this._id = profile.id;
        this._academic_year = profile.academic_year;
        this._firstname = profile.firstname;
        this._lastname = profile.lastname;
        this._mail = profile.mail;
        this._status_id = profile.status_id;
        this._account_id = profile.account_id;
    }

    /**
     * This method gets all the profiles from the API and gets them as ProfileModel.
     * @returns A promise that resolves into an array of ProfileModel or an ErrorResponse.
     */
    static async getAllProfiles(): Promise<ProfileModel[] | ErrorResponse<Profile[]>> {
        const response = await ProfileAPI.getAllProfiles();

        if (response.isError()) return response as ErrorResponse<Profile[]>
        const result: ProfileModel[] = [];
        response.responseObject().forEach((element: Profile) => {
            result.push(new ProfileModel(element));
        });
        return result
    }

    /**
     * This method gets a ProfileModel based on the profile_id provided.
     * @param profile_id The id of the profile to be returned.
     * @returns A promise that resolves into a ProfileModel or an ErrorResponse.
     */
    static async getProfileById(profile_id: number): Promise<ProfileModel | ErrorResponse<Profile>> {
        const response = await ProfileAPI.getProfileById(profile_id);
        if (response.isError()) return response as ErrorResponse<Profile>;
        return new ProfileModel(response.responseObject());
    }

    /**
     * This method sends and handles the request to create a new ProfileModel.
     * @returns A promise that resolves into a ProfileModel or an ErrorResponse.
     */
    async createProfile(): Promise<undefined | ErrorResponse<undefined>> {
        const body: ProfileInCreate = {
            firstname: this._firstname,
            lastname: this._lastname,
            academic_year: this._academic_year,
            mail: this._mail,
            account_id: 0,
            status_id: this.status_id
        }
        console.log(body)
        const response = await ProfileAPI.createProfile(body);
        if (response.isError()) return response as ErrorResponse<undefined>;
    }

    /**
     * This method updates the current profile with the information stored in the instance.
     * @returns A promise that resolves into undefined or an ErrorResponse.
     */
    async updateProfile(): Promise<undefined | ErrorResponse<undefined>> {
        const body: ProfileInUpdate = {
            firstname: this._firstname,
            lastname: this._lastname,
            mail: this._mail,
            account_id: this._account_id,
            status_id: this._status_id,
            quota : 0
        }
        const response = await ProfileAPI.updateProfile(this._id, body);
        if (response.isError()) return response as ErrorResponse<undefined>;
    }

    /**
     * This method deletes the current profile from the API.
     * @returns A promise that resolves into undefined or an ErrorResponse.
     */
    async deleteProfile(): Promise<undefined | ErrorResponse<undefined>> {
        const response = await ProfileAPI.deleteProfile(this._id);
        if (response.isError()) return response as ErrorResponse<undefined>;
    }


    get status_id(): string | undefined {
        return this._status_id;
    }
    set status_id(value: string | undefined) {
        this._status_id = value;
    }
    get account_id(): number | undefined {
        return this._account_id;
    }
    set account_id(value: number | undefined) {
        this._account_id = value;
    }
    get mail(): string {
        return this._mail;
    }
    set mail(value: string) {
        this._mail = value;
    }
    get lastname(): string {
        return this._lastname;
    }
    set lastname(value: string) {
        this._lastname = value;
    }
    get firstname(): string {
        return this._firstname;
    }
    set firstname(value: string) {
        this._firstname = value;
    }
    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }
}