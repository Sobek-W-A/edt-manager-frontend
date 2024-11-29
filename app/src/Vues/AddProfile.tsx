import {useState} from "react";
import ErrorResponse from "../scripts/API/Responses/ErrorResponse.ts";
import {AlertError, AlertSuccess} from "../Components/Utils/Alert.tsx";
import ProfileForm from "../Components/Profile/ProfileForm.tsx";
import ProfileModel from "../scripts/Models/ProfileModel.ts";
import {Profile} from "../scripts/API/APITypes/Profiles.ts";


function AddProfile() {

    const [errors, setErrors] = useState({
        emailError: '',
        prenomError: '',
        nomError: '',
        loginError: '',
        statutError: '',
        quotaError : ''
    });
    
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState(''); //email non obligatoire

    const [statut, setStatut] = useState('');

    const [quota, setQuota] = useState(''); //éditable ou non

    const [login, setLogin] = useState('');

    const [generalError, setGeneralError] = useState("");
    const [success, setSuccess] = useState(false);

    const setEmailError = (error: string) => setErrors(prev => ({ ...prev, emailError: error }));
    const setPrenomError = (error: string) => setErrors(prev => ({ ...prev, prenomError: error }));
    const setNomError = (error: string) => setErrors(prev => ({ ...prev, nomError: error }));
    const setLoginError = (error: string) => setErrors(prev => ({ ...prev, nomError: error }));
    const setStatutError = (error: string) => setErrors(prev => ({ ...prev, nomError: error }));
    const setQuotaError = (error: string) => setErrors(prev => ({ ...prev, nomError: error }));


    const handleSignUp = async () => {
        const userData: Profile = {
            id: 0,
            academic_year: [2024, 2025],
            firstname: prenom,
            lastname: nom,
            mail: email
            //status_id : statut,
            //account_id: 0,          // TODO

        };

        setSuccess(true);

        try {
            const model = new ProfileModel(userData);
            const response = await model.createProfile();

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
                    <h1 className="text-4xl font-semibold">Création de profile</h1>
                    <p className="text-sm">Créez un nouveau profile</p>
                </div>

                {generalError && <AlertError title="Oups ! Une erreur est survenue." details={generalError} />}
                {success && <AlertSuccess title="Succès !" details="L'inscription a été réalisée avec succès !" />}

                <ProfileForm
                    email={email} setEmail={setEmail}
                    prenom={prenom} setPrenom={setPrenom}
                    nom={nom} setNom={setNom}
                    login={login} setLogin={setLogin}
                    statut={statut} setStatut={setStatut}
                    quota={quota} setQuota={setQuota}
                    handleSubmit={handleSignUp}
                    errors={{
                        ...errors,
                        setEmailError,
                        setPrenomError,
                        setNomError,
                        setLoginError,
                        setStatutError,
                        setQuotaError
                    }}
                />
            </div>
        </div>
    );
}

export default AddProfile;