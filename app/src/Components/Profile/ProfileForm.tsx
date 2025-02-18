import React, {useState} from 'react';
import Input from "../Utils/Input.tsx";
import ErrorResponse from "../../scripts/API/Responses/ErrorResponse.ts";
import StatusModel from "../../scripts/Models/StatusModel.ts";
import AccountModel from "../../scripts/Models/AccountModel.ts";
import {Account} from "../../scripts/API/APITypes/Accounts.ts";

const global_academic_year = 2024;

interface UserFormProps {
    email: string;
    setEmail: (value: string) => void;
    prenom: string;
    setPrenom: (value: string) => void;
    nom: string;
    setNom: (value: string) => void;
    account: number;
    setAccount: (value: number) => void;
    statut: number;
    setStatut: (value: number) => void;
    quota: number;
    setQuota: (value: number | undefined) => void;


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
        account: string;
        setAccountError: (value: string) => void;
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
                                               account,
                                               setAccount,
                                                statut,
                                                setStatut,
                                                quota,
                                                setQuota,
                                               handleSubmit,
                                               errors
                                           }) => {


    const [availableStatus, setAvailableStatus] = useState<StatusModel[]>([])
    const [availableAccounts, setAvailableAccounts] = useState<Account[]>([])
    const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [accountName, setAccountName] = useState("");

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

    const handleStatut = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value)
        const listMatch = availableStatus.find(function (element) {
            return element.id === Number(e.target.value)
        } )
        setStatut(Number(listMatch?.id));
        setQuota(listMatch?.quota);

    };

    const handleQuota = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuota(Number(e.target.value));
        errors.setStatutError(Number(e.target.value) > 0 ? "" : "Veuillez choisir quota valide.");
    };

    React.useEffect(() => {

        StatusModel.getAllStatusByYear().then(response => {
            if (!(response instanceof ErrorResponse)) {
                setAvailableStatus(response);
            }
        });

        AccountModel.getAllAccountsNotLinkedToProfile(global_academic_year).then(response => {
            if (!(response instanceof ErrorResponse)) {
                setAvailableAccounts(response);
            }
        });



    }, []);

    React.useEffect(() => {
        if (searchTerm) {
            setFilteredAccounts(
                availableAccounts.filter(account =>
                    account.login.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredAccounts([]);
        }

        setAccountName(availableAccounts.find((element) => element.id === account)?.login);
    }, [searchTerm, availableAccounts]);

    const handleAccountSelection = (selectedAccount: Account) => {
        setSearchTerm(selectedAccount.login);
        console.log(selectedAccount.id)
        setAccount(selectedAccount.id);
        setFilteredAccounts([]);
    };

    const resetAccount = () => {
        setAccount(-1)
    }

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

            <div>
                <label className="form-label block text-sm font-medium text-green-700">Lier un Compte</label>
                <input
                    className={"w-full px-3 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"}
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un compte..."
                 />
                {filteredAccounts.length > 0 && (
                    <ul className="dropdown">
                        {filteredAccounts.map((acc) => (
                            <li key={acc.id} onClick={() => handleAccountSelection(acc)}
                                className="cursor-pointer hover:bg-gray-200">
                                {acc.login}
                            </li>
                        ))}
                    </ul>
                )}
                <label className="form-label block text-sm font-medium text-green-700">{account === -1 ? (<div>Aucun compte lié</div>) : (<div>Compte lié : {accountName} (id : {account}) <button className="text-red-700" onClick={resetAccount}> retirer</button></div>)}</label>

            </div>

            <div>
                <label className="form-label block text-sm font-medium text-green-700">Status</label>
                <select value={statut} onChange={e => handleStatut(e)}>
                    <option value="" disabled></option>
                    {availableStatus.map(option => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                </select>
            </div>

            <Input
                label="Quota"
                type="text"
                placeholder="quota"
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