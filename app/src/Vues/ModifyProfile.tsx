import {useEffect, useRef, useState} from 'react';
import ErrorResponse from "../scripts/API/Responses/ErrorResponse.ts";
import {AlertError, AlertSuccess} from "../Components/Utils/Alert.tsx";
import UserForm from "../Components/Profile/ProfileForm.tsx";
import {useParams} from "react-router";
import ProfileModel from "../scripts/Models/ProfileModel.ts";

const ModifyProfile = () => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');

    const [statut, setStatut] = useState(0);

    const [quota, setQuota] = useState(0);

    const [id_account, setId_account] = useState(-1);

    const [generalError, setGeneralError] = useState("");
    const [success, setSuccess] = useState(false);

    const params = useParams();
    const userModel = useRef<ProfileModel>();

    // Gestion des erreurs dans un objet pour les transmettre au formulaire
    const [errors, setErrors] = useState({
        emailError: '',
        prenomError: '',
        nomError: '',
        loginError: ''
    });

    useEffect(() => {
        const getProfileForUpdate = ProfileModel.getProfileById(Number(params.id));
        getProfileForUpdate.then((profile) => {
            if (profile instanceof ProfileModel) {

                console.log(profile);

                userModel.current = profile;
                // Accéder aux propriétés sans underscore
                setEmail(userModel.current.mail || '');
                setPrenom(userModel.current.firstname || '');
                setNom(userModel.current.lastname || '');
                setId_account(userModel.current.account_id || -1);
                setQuota(userModel.current.quota)
                setStatut(Number(userModel.current.status_id))
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
    const setLoginError = (error : string) => setErrors(prev => ({ ...prev, loginError: error }));

    const handleSignUp = async () => {

        /**const userData : ProfileModel = {
            lastname : nom,
            firstname : prenom,
            mail : email,
            account_id : id_account
        };**/

        try {
            // We check if the user has been successfully fetched.
            if (!userModel.current) {
                setGeneralError("Utilisateur non trouvé.");
                return;
            }
            const response = await userModel.current.updateProfile();
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
        <div className="flex flex-col items-center justify-center pt-12 pb-12">
            <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-semibold">Modifer un profile</h1>
                    <p className="text-sm">Modification du profile {email}</p>
                </div>

                {generalError && <AlertError title="Oups ! Une erreur est survenue." details={generalError}/>}
                {success && <AlertSuccess title="Succès !" details="La mise à jour a été réalisée avec succès !"/>}

                <UserForm
                    email={email} setEmail={setEmail}
                    prenom={prenom} setPrenom={setPrenom}
                    nom={nom} setNom={setNom}
                    quota={quota} setQuota={setQuota}
                    account={id_account} setAccount={setId_account}
                    statut={statut} setStatut={setStatut}
                    handleSubmit={handleSignUp}
                    errors={{
                        ...errors,
                        setEmailError,
                        setPrenomError,
                        setNomError,
                        setLoginError
                    }}
                />
                </div>
            </div>
            );
            };

            export default ModifyProfile;
