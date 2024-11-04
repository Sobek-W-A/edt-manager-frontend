import EyeSlashIcon from "./icons/EyeSlashIcon.jsx";
import EyeIcon from "./icons/EyeIcon.jsx";
import React, {useState} from "react";

function PasswordInput (props) {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return <div className="form-field">
        <label className="form-label">{props.label}</label>
        <div className="form-control">
            <input
                placeholder="••••••••••"
                type={showPassword ? 'text' : 'password'}
                className={"input max-w-full " + (props.error !== "" && " input-error")}
                value={props.value}
                onChange={props.onChange}
            />
            <button type="button" className="btn btn-ghost px-1.5" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
        </div>
        <label className="form-label">
            <span className="form-label-alt text-error">{props.error}</span>
        </label>
    </div>
}

export default PasswordInput;