import {StatusType} from "../API/APITypes/Status.ts";
import APIResponse from "../API/Responses/APIResponse.ts";
import StatusAPI from "../API/ModelAPIs/StatusAPI.ts";
import ErrorResponse from "../API/Responses/ErrorResponse.ts";

export default class StatusModel {


    private _id            : number;
    private _name          : string;
    private _description   : string;
    private _academic_year : number;
    private _quota         : number;

    constructor(status: StatusType) {
        this._id            = status.id;
        this._name          = status.name;
        this._description   = status.description;
        this._academic_year = status.academic_year;
        this._quota         = status.quota;
    }

    /**
     * This method builds status models from all available models in the API.
     * @returns A promise that resolves into an array of StatusModel or into an Error.
     */
    static async getAllStatusByYear(): Promise<StatusModel[] | ErrorResponse<StatusType[]>> {
        const response: APIResponse<StatusType[]> = await StatusAPI.getStatusByAcademicYear();
        console.log(response);
        if (response.isError()) return response as ErrorResponse<StatusType[]>;

        const result: StatusModel[] = [];
        response.responseObject().forEach((element: StatusType) => { result.push(new StatusModel(element)); });
        return result;
    }

    /**
     * This method builds a status model from the status specified by the id provided.
     * @param status_id The id of the status to be returned.
     * @returns A promise that resolves into a StatusModel or into an Error.
     */
    static async getStatusById(status_id: number): Promise<StatusModel | ErrorResponse<StatusType>> {
        const response: APIResponse<StatusType> = await StatusAPI.getStatusById(status_id);
        if (response.isError()) return response as ErrorResponse<StatusType>;

        return new StatusModel(response.responseObject());
    }

    get quota(): number {
        return this._quota;
    }
    set quota(value: number) {
        this._quota = value;
    }
    get academic_year(): number {
        return this._academic_year;
    }
    set academic_year(value: number) {
        this._academic_year = value;
    }
    get description(): string {
        return this._description;
    }
    set description(value: string) {
        this._description = value;
    }
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }
    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }
}
