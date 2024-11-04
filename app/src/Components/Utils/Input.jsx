import React from "react";

function Input (props) {

    return <div className="form-field">
        <label className="form-label">{props.label}</label>

        <input
            placeholder={props.placeholder}
            type={props.type}
            className={"input max-w-full " + (props.error !== "" && " input-error")}
            value={props.value}
            onChange={props.onChange}
        />
        <label className="form-label">
            <span className="form-label-alt text-error">{props.error}</span>
        </label>
    </div>
}

export default Input;