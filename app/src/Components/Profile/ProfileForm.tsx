import React, {useEffect} from 'react';
import Input from "../Utils/Input.tsx";

interface UserFormProps {
    email: string;
    setEmail: (value: string) => void;
    prenom: string;
    setPrenom: (value: string) => void;
    nom: string;
    setNom: (value: string) => void;
    login: string;
    setLogin: (value: string) => void;
    statut: string;
    setStatut: (value: string) => void;
    quota: string;
    setQuota: (value: string) => void;
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
        statutError: string;
        setStatutError: (value: string) => void;
        quotaError: string;
        setQuotaError: (value: string) => void;
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
                                                statut,
                                                setStatut,
                                                quota,
                                                setQuota,
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

    const handleStatut = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatut(e.target.value);
        errors.setStatutError(e.target.value.length >= 2 ? "" : "Veuillez choisir un statut.");
    };

    const handleQuota = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuota(e.target.value);
        errors.setStatutError(e.target.value.length >= 2 ? "" : "Veuillez choisir quota valide.");
    };

    useEffect(() => {
        //get les status
    })

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

            <Input
                label="Statut"
                type="text"
                placeholder="Statut"
                error={errors.statutError}
                value={statut}
                onChange={handleStatut}
            />

            <Input
                label="Quota"
                type="text"
                placeholder="Quota"
                error={errors.quotaError}
                value={quota}
                onChange={handleQuota}
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