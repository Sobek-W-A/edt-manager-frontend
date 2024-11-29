import React from 'react';
import Input from "../Utils/Input.tsx";
import PasswordInput from "./PasswordInput.tsx";

interface UserFormProps {
    login: string;
    setLogin: (value: string) => void;

    password: string;
    setPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    handleSubmit: () => void;
    errors: {
        loginError: string;
        setLoginError: (value: string) => void;
        emailError: string;
        setEmailError: (value: string) => void;
        passwordError: string;
        setPasswordError: (value: string) => void;
        confirmPasswordError: string;
        setConfirmPasswordError: (value: string) => void;
    };
}

const AccountForm: React.FC<UserFormProps> = ({
                                                login,
                                                setLogin,
                                               password,
                                               setPassword,
                                               confirmPassword,
                                               setConfirmPassword,
                                               handleSubmit,
                                               errors
                                           }) => {



    const handleLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(e.target.value);
        errors.setLoginError(e.target.value.length >= 2 ? "" : "Veuillez entrer un login valide, d'au moins 2 caractères.");
    };

    const handleMotDePasse = (e: React.ChangeEvent<HTMLInputElement>) => {
        const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}:;<>,.?~[\]\-\\/])[a-zA-Z0-9!@#$%^&*()_+{}:;<>,.?~[\]\-\\/]{8,}$/;
        setPassword(e.target.value);
        errors.setPasswordError(re.test(e.target.value) ? "" : "Veuillez entrer un mot de passe conforme.");
        errors.setConfirmPasswordError(e.target.value !== confirmPassword ? "Les mots de passe doivent être identiques." : "");
    };

    const handleMdpConfirmation = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        errors.setConfirmPasswordError(e.target.value !== password ? "Les mots de passe doivent être identiques." : "");
    };

    return (
        <div className="form-group">

            <Input
                label="Login"
                type="text"
                placeholder="Login"
                error={errors.loginError}
                value={login}
                onChange={handleLogin}
            />

            <PasswordInput
                label="Mot de passe"
                error={errors.passwordError}
                value={password}
                onChange={handleMotDePasse}
            />

            <PasswordInput
                label="Confirmer le mot de passe"
                error={errors.confirmPasswordError}
                value={confirmPassword}
                onChange={handleMdpConfirmation}
            />

            <div className="form-field pt-5">
                <button
                    type="button"
                    className="w-full px-4 py-2 text-white rounded hover:border-green-300 bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={handleSubmit}
                >
                    Soumettre
                </button>
            </div>
        </div>
    );
}

export default AccountForm;