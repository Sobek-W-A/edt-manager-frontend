import React, {useState} from "react";
import Input from "../components/Utils/Input.jsx";
import {Link} from "react-router-dom";
import {AlertError, AlertSuccess} from "../components/Utils/Alert.jsx";
import PasswordInput from "../components/Account/PasswordInput.jsx";
import UserModel from "../scripts/Models/UserModel.ts";
import ErrorResponse from "../scripts/API/Responses/ErrorResponse.ts";
import '../index.css';

function Register () {

    const [email, setEmail] = useState('');
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [login, setLogin] = useState('');

    const [emailError, setEmailError] = useState('');
    const [prenomError, setprenomError] = useState('');
    const [nomError, setnomError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');

    const [generalError, setGeneralError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSignUp = async () => {
                const userData = {
                    id : 0,
                    login: login,
                    firstname: prenom,
                    lastname: nom,
                    mail: email,
                };

                setSuccess(true)

                try {

                    const userModel = new UserModel(userData);
                    userModel.password = password
                    userModel.password_confirm = confirmPassword

                    const response = await userModel.createUser();

                    if (response instanceof ErrorResponse) {
                        setSuccess(false)
                        if (response.errorCode() === 401) {
                            setGeneralError("Identifiants incorrects");
                        } else {
                            setGeneralError(`Une erreur est survenue: ${response.errorMessage()}`);
                        }
                        return;
                    }

                } catch (err) {
                    setSuccess(false)
                    const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
                    setGeneralError(`Une erreur est survenue: ${errorMessage}`);
                }
    };

    const handleMailType = (e) => {

        const re = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
        if (re.test(e.target.value)){
            setEmailError("")
        }else {
            setEmailError("Veuillez entrer une adresse email valide.")
        }
        //console.log(emailError)
        setEmail(e.target.value)
    };

    const handlePrenom = (e) => {

        if (e.target.value.length >= 2){
            setprenomError("")

        }else {
            setprenomError("Veuillez entrer un prénom valide, d'au moins 2 caractères.")
        }
        setPrenom(e.target.value)
    };

    const handleNom = (e) => {

        if (e.target.value.length >= 2){
            setnomError("")

        }else {
            setnomError("Veuillez entrer un nom valide, d'au moins 2 caractères.")
        }
        setNom(e.target.value)
    };

    const handleLogin = (e) => {

        if (e.target.value.length >= 2){
            setLoginError("")

        }else {
            setLoginError("Veuillez entrer un login valide, d'au moins 2 caractères.")
        }
        setLogin(e.target.value)
    };

    const handleMotDePasse = (e) => {

        const re = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}:;<>,.?~\\[\\]\\-\\\\\\/])[\\w!@#$%^&*()_+{}:;<>,.?~\\[\\]\\-\\\\\\/]{8,}$")
        if (re.test(e.target.value)){
            setPasswordError("")
        }else {
            setPasswordError("Veuillez entrer un mot de passe composé d'au moins 8 caractères, dont une majuscule, une minuscule et un caractère spécial.")
        }
        setPassword(e.target.value);
        setConfirmPasswordError(e.target.value != confirmPassword ? "Les mots de passe doivent être identiques." : "");
    };

    const handleMdpConfirmation = (e) => {
        setConfirmPasswordError(e.target.value != password ? "Les mots de passe doivent être identiques." : "");
        setConfirmPassword(e.target.value);
    }


    return <div className="mx-auto flex w-full max-w-sm flex-col gap-6 mt-12">
        <div className="flex flex-col items-center">
            <h1 className="text-4xl font-semibold">Création de compte</h1>
            <p className="text-sm">Creez un nouvel utilisateur</p>
        </div>

        {generalError !== "" && <AlertError title={"Oups ! Une erreur est survenue."} details={"" + generalError} />}
        {success && <AlertSuccess title={"Succès !"} details={"Votre inscription a été réalisée avec succès !"} />}

        <div className="form-group">
            <Input
                label="Adresse email"
                type="email"
                placeholder="mail@exemple.fr"
                error={emailError}
                value={email}
                onChange={handleMailType}
            />



            <Input
                label="Prénom"
                type="text"
                placeholder="Prénom"
                error={prenomError}
                value={prenom}
                onChange={handlePrenom}
            />

            <Input
                label="Nom"
                type="text"
                placeholder="Nom"
                error={nomError}
                value={nom}
                onChange={handleNom}
            />

            <Input
                label="Login"
                type="text"
                placeholder="Login"
                error={loginError}
                value={login}
                onChange={handleLogin}
            />

            <PasswordInput
                label="Mot de passe"
                error={passwordError}
                value={password}
                onChange={handleMotDePasse}
                />

            <PasswordInput
                label="Confirmer le mot de passe"
                error={confirmPasswordError}
                value={confirmPassword}
                onChange={handleMdpConfirmation}
            />

            <div className="form-field pt-5">
                <div className="form-control justify-between mb-6">
                    <button type="button" className="w-full px-4 py-2 text-white rounded hover:border-green-300 bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500" onClick={handleSignUp}>
                        Créer compte
                    </button>
                </div>
            </div>
        </div>
    </div>
}

export default Register;