import React, { useState } from "react";
import UserForm from "../Components/Account/UserForm.tsx";
import { AlertError, AlertSuccess } from "../Components/Utils/Alert.tsx";
import UserModel from "../scripts/Models/UserModel.ts";
import ErrorResponse from "../scripts/API/Responses/ErrorResponse.ts";

function Register() {
    const [email, setEmail] = useState('');
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [login, setLogin] = useState('');

    const [generalError, setGeneralError] = useState("");
    const [success, setSuccess] = useState(false);

    // Gestion des erreurs dans un objet pour les transmettre au formulaire
    const [errors, setErrors] = useState({
        emailError: '',
        prenomError: '',
        nomError: '',
        passwordError: '',
        confirmPasswordError: '',
        loginError: ''
    });

    // Mises à jour simplifiées pour chaque message d'erreur
    const setEmailError = (error) => setErrors(prev => ({ ...prev, emailError: error }));
    const setPrenomError = (error) => setErrors(prev => ({ ...prev, prenomError: error }));
    const setNomError = (error) => setErrors(prev => ({ ...prev, nomError: error }));
    const setPasswordError = (error) => setErrors(prev => ({ ...prev, passwordError: error }));
    const setConfirmPasswordError = (error) => setErrors(prev => ({ ...prev, confirmPasswordError: error }));
    const setLoginError = (error) => setErrors(prev => ({ ...prev, loginError: error }));

    const handleSignUp = async () => {
        const userData = {
            id: 0,
            login: login,
            firstname: prenom,
            lastname: nom,
            mail: email,
        };

        setSuccess(true);

        try {
            const userModel = new UserModel(userData);
            userModel.password = password;
            userModel.password_confirm = confirmPassword;

            const response = await userModel.createUser();

            if (response instanceof ErrorResponse) {
                setSuccess(false);
                setGeneralError(response.errorCode() === 401
                    ? "Identifiants incorrects"
                    : `Une erreur est survenue: ${response.errorMessage()}`
                );

            }

        } catch (err) {
            setSuccess(false);
            setGeneralError(`Une erreur est survenue: ${err instanceof Error ? err.message : "Erreur inconnue"}`);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-sm flex-col gap-6 mt-12 mb-6">
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-semibold">Création de compte</h1>
                <p className="text-sm">Créez un nouvel utilisateur</p>
            </div>

            {generalError && <AlertError title="Oups ! Une erreur est survenue." details={generalError} />}
            {success && <AlertSuccess title="Succès !" details="L'inscription a été réalisée avec succès !" />}

            <UserForm
                email={email} setEmail={setEmail}
                prenom={prenom} setPrenom={setPrenom}
                nom={nom} setNom={setNom}
                login={login} setLogin={setLogin}
                password={password} setPassword={setPassword}
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                handleSubmit={handleSignUp}
                errors={{
                    ...errors,
                    setEmailError,
                    setPrenomError,
                    setNomError,
                    setPasswordError,
                    setConfirmPasswordError,
                    setLoginError
                }}
            />
        </div>
    );
}

export default Register;