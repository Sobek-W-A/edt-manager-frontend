import {ChangeEventHandler} from "react";

interface InputProps {
    label : string;
    placeholder: string;
    type: string;
    error: string;
    value: string | number;
    name?: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

function Input (props:InputProps) {

    return <div className="form-field ">
        <label className="form-label block text-sm font-medium text-green-700">{props.label}</label>

        <input
            placeholder={props.placeholder}
            type={props.type}
            className={"w-full px-3 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" + (props.error !== "" && " input-error")}
            value={props.value}
            name={props.name}
            onChange={props.onChange}
        />
        <label className="form-label">
            <span className="text-red-600 text-sm text-center">{props.error}</span>
        </label>
    </div>
}

export default Input;