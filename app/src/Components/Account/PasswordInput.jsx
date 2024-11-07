import EyeSlashIcon from "./icons/EyeSlashIcon.jsx";
import EyeIcon from "./icons/EyeIcon.jsx";
import React, {useState} from "react";

function PasswordInput (props) {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return <div className="form-field">
        <label className="form-label block text-sm font-medium text-green-700">{props.label}</label>
        <div className="form-control">
            <input
                placeholder="••••••••••"
                type={showPassword ? 'text' : 'password'}
                className={"input w-4/5 px-3 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" + (props.error !== "" && " input-error")}
                value={props.value}
                onChange={props.onChange}
            />
            <button type="button" className="btn btn-ghost px-1.5" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
        </div>
        <label className="form-label">
            <span className="text-red-600 text-sm text-center">{props.error}</span>
        </label>
    </div>
}

export default PasswordInput;