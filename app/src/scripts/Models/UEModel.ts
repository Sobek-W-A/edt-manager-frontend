import {UE} from "../API/APITypes/UETypes.ts";
import ErrorResponse from "../API/Responses/ErrorResponse.ts";
import UEAPI from "../API/ModelAPIs/UEAPI.ts";
import {Course} from "../API/APITypes/Course.ts";

export default class UEModel {


    private _id               : string;
    private _name             : string;
    private _courses           : Course[];
    private _academic_year              : number;

    constructor(ue : UE) {
        console.log("ici : " + JSON.stringify( ue))
        this._id = ue.id
        this._name = ue.name
        this._courses = ue.courses
        this._academic_year = ue.academic_year
    }

    /**
     * This method gets and builds an AccountModel based on the account_id provided.
     * @returns A promise that resolves into an AccountModel or an ErrorResponse.
     * @param ue_id
     */
    static async getUEById(ue_id: string): Promise<UEModel | ErrorResponse<UE>> {
        const response = await UEAPI.getUEById(ue_id);

        if (response.isError()) return response as ErrorResponse<UE>;
        console.log(response.responseObject())
        return new UEModel(response.responseObject());
    }

    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }
    get id(): string {
        return this._id;
    }
    set id(value: string) {
        this._id = value;
    }
    get courses(): Course[] {
        return this._courses;
    }
    get academic_year(): number {
        return this._academic_year;
    }


}