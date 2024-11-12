import {useEffect, useRef, useState} from 'react';
import UserModel from "../scripts/Models/UserModel.ts";
import ErrorResponse from "../scripts/API/Responses/ErrorResponse.ts";
import {AlertError, AlertSuccess} from "../Components/Utils/Alert.tsx";
import UserForm from "../Components/Account/UserForm.tsx";
import {useParams} from "react-router";
import {UserInPatchType} from "../scripts/API/APITypes/Users.ts";

const ModifyUser = () => {
    const [email, setEmail] = useState('');
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [login, setLogin] = useState('');

    const [generalError, setGeneralError] = useState("");
    const [success, setSuccess] = useState(false);

    const params = useParams();
    const userModel = useRef<UserModel>();

    // Gestion des erreurs dans un objet pour les transmettre au formulaire
    const [errors, setErrors] = useState({
        emailError: '',
        prenomError: '',
        nomError: '',
        passwordError: '',
        confirmPasswordError: '',
        loginError: ''
    });

    useEffect(() => {
        const getUserForUpdate = UserModel.getUserById(Number(params.id));
        getUserForUpdate.then((user) => {
            // We check if we could get a user.
            if (user instanceof UserModel) {
                userModel.current = user;
                // Accéder aux propriétés sans underscore
                setEmail(userModel.current.mail || '');
                setPrenom(userModel.current.firstname || '');
                setNom(userModel.current.lastname || '');
                setLogin(userModel.current.login || '');
                // Laisser les champs de mot de passe vides pour des raisons de sécurité
                setPassword('');
                setConfirmPassword('');
            } else {
                setGeneralError("Utilisateur non trouvé.");
            }})
            .catch((error) => {
                setGeneralError("Erreur lors de la récupération de l'utilisateur.");
                console.error("Erreur de chargement de l'utilisateur:", error);
            });
    }, [params.id]);

    // Mises à jour simplifiées pour chaque message d'erreur
    const setEmailError = (error : string) => setErrors(prev => ({ ...prev, emailError: error }));
    const setPrenomError = (error : string) => setErrors(prev => ({ ...prev, prenomError: error }));
    const setNomError = (error : string) => setErrors(prev => ({ ...prev, nomError: error }));
    const setPasswordError = (error : string) => setErrors(prev => ({ ...prev, passwordError: error }));
    const setConfirmPasswordError = (error : string) => setErrors(prev => ({ ...prev, confirmPasswordError: error }));
    const setLoginError = (error : string) => setErrors(prev => ({ ...prev, loginError: error }));

    const handleSignUp = async () => {

        const userData : UserInPatchType = {
            lastname : nom,
            firstname : prenom,
            mail : email,
            login : login,
            password : password ? password : undefined,
            password_confirm : confirmPassword ? confirmPassword : undefined
        };

        try {
            // We check if the user has been successfully fetched.
            if (!userModel.current) {
                setGeneralError("Utilisateur non trouvé.");
                return;
            }
            const response = await userModel.current.updateUser(userData);
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

        setSuccess(true);
    };

    return (
        <div className="mx-auto flex w-full max-w-sm flex-col gap-6 mt-12 mb-6">
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-semibold">Modifer un compte</h1>
                <p className="text-sm">Modifier l'utilisateur {login}</p>
            </div>

            {generalError && <AlertError title="Oups ! Une erreur est survenue." details={generalError} />}
            {success && <AlertSuccess title="Succès !" details="La mise à jour a été réalisée avec succès !" />}

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
};

export default ModifyUser;
