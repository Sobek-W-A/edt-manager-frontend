import EyeSlashIcon from "./icons/EyeSlashIcon.tsx";
import EyeIcon from "./icons/EyeIcon.tsx";
import {ChangeEventHandler, useState} from "react";

interface InputPasswordProps {
    label : string;
    error: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

function PasswordInput (props:InputPasswordProps) {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return <div className="form-field">
        <label className="form-label block text-sm font-medium text-green-700">{props.label}</label>
        <div className="relative form-control">
            <input
                placeholder="••••••••••"
                type={showPassword ? 'text' : 'password'}
                className={"input w-4/5 px-3 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" + (props.error !== "" && " input-error")}
                value={props.value}
                onChange={props.onChange}
            />
            <button type="button" className="absolute inset-y-0 right-0 px-3 flex items-center btn btn-ghost" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
        </div>
        <label className="form-label">
            <span className="text-red-600 text-sm text-center">{props.error}</span>
        </label>
    </div>
}

export default PasswordInput;