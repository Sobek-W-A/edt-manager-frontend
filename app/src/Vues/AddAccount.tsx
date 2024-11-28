import { useState } from "react";
import UserForm from "../Components/Account/UserForm.tsx";
import { AlertError, AlertSuccess } from "../Components/Utils/Alert.tsx";
import UserModel from "../scripts/Models/UserModel.ts";
import ErrorResponse from "../scripts/API/Responses/ErrorResponse.ts";

function AddAccount() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [login, setLogin] = useState('');

    const [generalError, setGeneralError] = useState("");
    const [success, setSuccess] = useState(false);

    // Gestion des erreurs dans un objet pour les transmettre au formulaire
    const [errors, setErrors] = useState({
        passwordError: '',
        confirmPasswordError: '',
        loginError: ''
    });

    // Mises à jour simplifiées pour chaque message d'erreur
    const setPasswordError = (error: string) => setErrors(prev => ({ ...prev, passwordError: error }));
    const setConfirmPasswordError = (error: string) => setErrors(prev => ({ ...prev, confirmPasswordError: error }));
    const setLoginError = (error: string) => setErrors(prev => ({ ...prev, loginError: error }));

    const handleSignUp = async () => {
        const userData = {
            id: 0,
            login: login,
        };

        setSuccess(true);

        try {
            const userModel: UserModel = new UserModel(userData); //User Model à changer
            userModel.setPasswords(password, confirmPassword)

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
        <div className="flex flex-col items-center justify-center pt-12 pb-12">
            <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-semibold">Création de compte</h1>
                <p className="text-sm">Créez un nouvel utilisateur</p>
            </div>

            {generalError && <AlertError title="Oups ! Une erreur est survenue." details={generalError} />}
            {success && <AlertSuccess title="Succès !" details="L'inscription a été réalisée avec succès !" />}

            <UserForm
                login={login} setLogin={setLogin}
                password={password} setPassword={setPassword}
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                handleSubmit={handleSignUp}
                errors={{
                    ...errors,
                    setPasswordError,
                    setConfirmPasswordError,
                    setLoginError
                }}
            />
            </div>
        </div>
    );
}

export default AddAccount;