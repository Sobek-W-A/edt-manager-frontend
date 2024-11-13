import React from 'react';
import Input from "../Utils/Input.tsx";
import PasswordInput from "./PasswordInput.tsx";

interface UserFormProps {
    email: string;
    setEmail: (value: string) => void;
    prenom: string;
    setPrenom: (value: string) => void;
    nom: string;
    setNom: (value: string) => void;
    login: string;
    setLogin: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    handleSubmit: () => void;
    errors: {
        emailError: string;
        setEmailError: (value: string) => void;
        prenomError: string;
        setPrenomError: (value: string) => void;
        nomError: string;
        setNomError: (value: string) => void;
        loginError: string;
        setLoginError: (value: string) => void;
        passwordError: string;
        setPasswordError: (value: string) => void;
        confirmPasswordError: string;
        setConfirmPasswordError: (value: string) => void;
    };
}

const UserForm: React.FC<UserFormProps> = ({
                                               email,
                                               setEmail,
                                               prenom,
                                               setPrenom,
                                               nom,
                                               setNom,
                                               login,
                                               setLogin,
                                               password,
                                               setPassword,
                                               confirmPassword,
                                               setConfirmPassword,
                                               handleSubmit,
                                               errors
                                           }) => {

    // Handlers de validation internes avec types
    const handleMailType = (e: React.ChangeEvent<HTMLInputElement>) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setEmail(e.target.value);
        errors.setEmailError(re.test(e.target.value) ? "" : "Veuillez entrer une adresse email valide.");
    };

    const handlePrenom = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrenom(e.target.value);
        errors.setPrenomError(e.target.value.length >= 2 ? "" : "Veuillez entrer un prénom valide, d'au moins 2 caractères.");
    };

    const handleNom = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNom(e.target.value);
        errors.setNomError(e.target.value.length >= 2 ? "" : "Veuillez entrer un nom valide, d'au moins 2 caractères.");
    };

    const handleLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(e.target.value);
        errors.setLoginError(e.target.value.length >= 2 ? "" : "Veuillez entrer un login valide, d'au moins 2 caractères.");
    };

    const handleMotDePasse = (e: React.ChangeEvent<HTMLInputElement>) => {
        const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}:;<>,.?~\[\]\-\\/])[a-zA-Z0-9!@#$%^&*()_+{}:;<>,.?~\[\]\-\\/]{8,}$/;
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
                label="Adresse email"
                type="email"
                placeholder="mail@exemple.fr"
                error={errors.emailError}
                value={email}
                onChange={handleMailType}
            />

            <Input
                label="Prénom"
                type="text"
                placeholder="Prénom"
                error={errors.prenomError}
                value={prenom}
                onChange={handlePrenom}
            />

            <Input
                label="Nom"
                type="text"
                placeholder="Nom"
                error={errors.nomError}
                value={nom}
                onChange={handleNom}
            />

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

export default UserForm;