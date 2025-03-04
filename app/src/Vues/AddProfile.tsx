import {useState} from "react";
import ErrorResponse from "../scripts/API/Responses/ErrorResponse.ts";
import {AlertError, AlertSuccess} from "../Components/Utils/Alert.tsx";
import ProfileForm from "../Components/Profile/ProfileForm.tsx";
import ProfileModel from "../scripts/Models/ProfileModel.ts";
import {ProfileInCreate} from "../scripts/API/APITypes/Profiles.ts";



function AddProfile() {

    const [errors, setErrors] = useState({
        emailError: '',
        prenomError: '',
        nomError: '',
        loginError: '',
        statutError: '',
        accountError: '',
        quotaError : ''
    });
    
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState(''); //email non obligatoire

    const [statut, setStatut] = useState(0);

    const [quota, setQuota] = useState(0);

    const [idAccount, setidAccount] = useState(-1);

    const [generalError, setGeneralError] = useState("");
    const [success, setSuccess] = useState(false);

    const global_academic_year = window.sessionStorage.getItem("academic_year");

    const setEmailError = (error: string) => setErrors(prev => ({ ...prev, emailError: error }));
    const setPrenomError = (error: string) => setErrors(prev => ({ ...prev, prenomError: error }));
    const setNomError = (error: string) => setErrors(prev => ({ ...prev, nomError: error }));
    const setLoginError = (error: string) => setErrors(prev => ({ ...prev, nomError: error }));
    const setStatutError = (error: string) => setErrors(prev => ({ ...prev, nomError: error }));
    const setQuotaError = (error: string) => setErrors(prev => ({ ...prev, nomError: error }));



    const handleSignUp = async () => {
        const userData: ProfileInCreate = {
            academic_year: global_academic_year,
            firstname: prenom,
            lastname: nom,
            mail: email,
            quota : quota,
            account_id: idAccount,
            status_id : statut

        };

        console.log(userData)


        try {
            const model = new ProfileModel(userData);
            const response = await model.createProfile();

            if (response instanceof ErrorResponse) {
                setSuccess(false);
                setGeneralError(response.errorCode() === 401
                    ? "Identifiants incorrects"
                    : `Une erreur est survenue: ${response.errorMessage()}`
                );
            } else {
                setSuccess(true);
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
                    <h1 className="text-4xl font-semibold">Création de profil</h1>
                    <p className="text-sm">Créez un nouveau profil pour {global_academic_year}</p>
                </div>

                {!success && generalError && <AlertError title="Oups ! Une erreur est survenue." details={generalError} />}
                {success && <AlertSuccess title="Succès !" details="L'inscription a été réalisée avec succès !" />}

                <ProfileForm
                    email={email} setEmail={setEmail}
                    prenom={prenom} setPrenom={setPrenom}
                    nom={nom} setNom={setNom}
                    account={idAccount} setAccount={setidAccount}
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