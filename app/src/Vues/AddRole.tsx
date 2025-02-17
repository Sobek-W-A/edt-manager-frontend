import React, { useState, useEffect } from "react";
import AddRoleCard from "../Components/AddRole/AddRoleCard";
import Notification from "../Components/AddRole/AddRolePopUp";
import AccountAPI from "../scripts/API/ModelAPIs/AccountAPI";
import RoleAPI from "../scripts/API/ModelAPIs/RoleAPI";
import APIResponse from "../scripts/API/Responses/APIResponse.ts";
import { Account } from "../scripts/API/APITypes/Accounts.ts";
import { Profile } from "../scripts/API/APITypes/Profiles.ts";
import { RoleType } from "../scripts/API/APITypes/Role.ts";
import ProfileAPI from "../scripts/API/ModelAPIs/ProfileAPI.ts";


function AddRole() {
    const [accountsAndProfils, setAccountsAndProfils] = useState<(Account)[]>([]);
    const [filteredAccountsAndProfiles, setFilteredAccountsAndProfiles] = useState<(Account)[]>([]);
    const [accounts, setAccounts] = useState<(Account)[]>([]);
    const [filteredAccounts, setFilteredAccounts] = useState<(Account)[]>([]);
    const [profiles, setProfiles] = useState<(Profile)[]>([]);
    const [filteredProfiles, seFilteredProfiles] = useState<(Profile)[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openRoleMenu, setOpenRoleMenu] = useState<string | null>(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showNotification, setShowNotification] = useState(false);
    const [selectedTag, setSelectedTag] = useState<RoleType>({} as RoleType);
    const [userRoles, setUserRoles] = useState<{ user: Account, role: RoleType }[]>([]);
    const [rolesList, setRolesList] = useState<RoleType[]>([]);

    const ACADEMIC_YEAR = window.sessionStorage.getItem("academic_year") //2024


    // Utilisation de useEffect pour récupérer les comptes, les profils et les rôles
    useEffect(() => {
        const fetchData = async () => {
            // Récupérer les comptes liés à des profils
            const accountResponse = await AccountAPI.getAllAccounts();
            if (accountResponse.isError()) {
                setNotification({ message: `Une erreur est survenue : ${accountResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                setAccountsAndProfils(accountResponse.responseObject().filter((account: Account) => account.profile !== null));
                setFilteredAccountsAndProfiles(accountResponse.responseObject().filter((account: Account) => account.profile !== null));
                setAccounts(accountResponse.responseObject().filter((account: Account) => account.profile === null));
                setFilteredAccounts(accountResponse.responseObject().filter((account: Account) => account.profile === null));
            }

            // Récupérer les profils seuls
            const profilesResponse = await ProfileAPI.getAllProfiles();
            if (profilesResponse.isError()) {
                setNotification({ message: `Une erreur est survenue : ${profilesResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                const filteredProfiles = profilesResponse.responseObject().filter((profile: Profile) => profile.account_id === null);
                setProfiles(filteredProfiles);
                seFilteredProfiles(filteredProfiles);
            }

            // Récupérer la liste des rôles
            const rolesResponse = await RoleAPI.getAllRoles();
            if (rolesResponse.isError()) {
                setNotification({ message: `Une erreur est survenue : ${rolesResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                setRolesList(rolesResponse.responseObject());
            }
        };

        fetchData().then();
    }, [ACADEMIC_YEAR]);

    // Utilisation de useEffect pour récupérer les rôles de chaque utilisateur
    useEffect(() => {
        const fetchUserRoles = async () => {
            const updatedUserRoles = [];
            for (let i = 0; i < accountsAndProfils.length; i++) {
                const userRolesResponse = await RoleAPI.getUserRoles(accountsAndProfils[i].id, ACADEMIC_YEAR);
                if (userRolesResponse.isError()) {
                    setNotification({ message: `Une erreur est survenue : ${userRolesResponse.errorMessage()}.`, type: 'alert-error' });
                    setShowNotification(true);
                    updatedUserRoles.push({ user: accountsAndProfils[i], role: {} as RoleType });
                } else {
                    updatedUserRoles.push({ user: accountsAndProfils[i], role: userRolesResponse.responseObject() });
                }
            }
            setUserRoles(updatedUserRoles);
        };

        if (accountsAndProfils.length > 0) {
            fetchUserRoles().then();
        }
    }, [accountsAndProfils]);
    
    // Utilisation de useEffect pour fermer la notification après 3 secondes
    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    // Gestion de la recherche
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());

        // On récupère les mots-clés de la recherche
        const keywords = e.target.value.toLowerCase();

        // Recherche des comptes & profiles, et comptes seuls par mots-clés
        if (keywords !== "") {
            AccountAPI.searchAccountsByKeywords(keywords).then((accountsByKeywords) => {
                if (accountsByKeywords.isError()) {
                    setNotification({ message: `Une erreur est survenue : ${accountsByKeywords.errorMessage()}.`, type: 'alert-error' });
                    setShowNotification(true);
                } else {
                    // On filtre les comptes ayant des profils et les comptes seuls
                    const accountsWithProfiles = accountsByKeywords.responseObject().filter((account: Account) => account.profile !== null);
                    const accountsWithoutProfiles = accountsByKeywords.responseObject().filter((account: Account) => account.profile === null && !accountsWithProfiles.some(acc => acc.id === account.id));
                    setFilteredAccountsAndProfiles(accountsWithProfiles);
                    setFilteredAccounts(accountsWithoutProfiles);
                }
            });
        } else {
            setFilteredAccountsAndProfiles(accountsAndProfils);
            setFilteredAccounts(accounts.filter(account => !accountsAndProfils.some(acc => acc.id === account.id)));
        }

        // Recherche des profils seuls par mots-clés
        if (keywords !== "") {
            ProfileAPI.searchProfilesByKeywords(keywords).then((profilesByKeywords) => {
                if (profilesByKeywords.isError()) {
                    setNotification({ message: `Une erreur est survenue : ${profilesByKeywords.errorMessage()}.`, type: 'alert-error' });
                    setShowNotification(true);
                } else {
                    const profilesWithoutAccounts = profilesByKeywords.responseObject().filter((profile: Profile) => !accountsAndProfils.some(acc => acc.profile?.id === profile.id));
                    seFilteredProfiles(profilesWithoutAccounts);
                }
            });
        } else {
            const profilesWithoutAccounts = profiles.filter(profile => !accountsAndProfils.some(acc => acc.profile?.id === profile.id));
            seFilteredProfiles(profilesWithoutAccounts);
        }
    };

    // Gestion du clic sur un tag
    const handleTagClick = (tag: RoleType) => {
        if (selectedTag === tag) {
            setSelectedTag({} as RoleType);
            return;
        }
        setSelectedTag(tag);
    };

    // Gestion de l'ajout d'un rôle à un utilisateur
    const addRoleToUser = (user: Account, selectedRole: RoleType) => {
        setAccountsAndProfils((prevUsers: (Account)[]) =>
            prevUsers.map((userTmp: Account) =>
            userTmp.id === user.id
                ? {
                    ...userTmp,
                    role: (RoleAPI.modifyUserRole(user.id, selectedRole, ACADEMIC_YEAR).then((response: APIResponse<RoleType>) => {
                        if (response.isError()) {
                            setNotification({ message: `Une erreur est survenue : ${response.errorMessage()}.`, type: 'alert-error' });
                            setShowNotification(true);
                        } else {
                            setNotification({ message: `Rôle "${selectedRole.name}" ajouté à ${user.profile ? user.profile.firstname : ""} ${user.profile ? user.profile.lastname : user.login}.`, type: 'alert-success' });
                            setShowNotification(true);
                            return selectedRole;
                        }
                    }))
                }
                : userTmp
            )
        );
        setOpenRoleMenu(null);

        // Afficher la notification d'ajout de rôle
        setNotification({ message: `Rôle "${selectedRole.name}" ajouté à ${user.profile ? user.profile.firstname : ""} ${user.profile ? user.profile.lastname : user.login}.`, type: 'alert-success' });
        setShowNotification(true); // Affiche la notification
    };

    // Gestion de la suppression d'un rôle à un utilisateur
    const removeRoleFromUser = (user: Account, roleToRemove: RoleType) => {
        setAccountsAndProfils(prevUsers =>
            prevUsers.map(userTmp =>
                userTmp.id === user.id
                    ? {
                        ...userTmp,
                        roles : (RoleAPI.removeUserRole(user.id, ACADEMIC_YEAR).then((response: APIResponse<undefined>) => {
                            if (response.isError()) {
                                setNotification({ message: `Une erreur est survenue : ${response.errorMessage()}.`, type: 'alert-error' });
                                setShowNotification(true);
                            } else {
                                setNotification({ message: `Rôle "${roleToRemove.name}" retiré à ${user.profile ? user.profile.firstname : ""} ${user.profile ? user.profile.lastname : user.login}.`, type: 'alert-success' });
                                setShowNotification(true);
                                return response.responseObject();
                            }
                        }))
                    }
                    : userTmp
            )
        );

        // Affiche la notification de rôle retiré
        setNotification({ message: `Rôle "${roleToRemove.name}" retiré à ${user.profile ? user.profile.firstname : ""} ${user.profile ? user.profile.lastname : user.login}.`, type: 'alert-success' });
        setShowNotification(true);
    };

    // Filtrer les comptes et profils par tags
    const filteredAccountsAndProfilesByTags = selectedTag.name !== undefined
        ? filteredAccountsAndProfiles.filter(user => userRoles.some(u => u.user.id === user.id && u.role.name === selectedTag.name))
        : filteredAccountsAndProfiles;

    // Filtrer les comptes par tags
    const filteredAccountsByTags = selectedTag.name !== undefined
        ? filteredAccounts.filter(user => userRoles.some(u => u.user.id === user.id && u.role.name === selectedTag.name))
        : filteredAccounts;

        return (
            <div className="flex justify-center mt-6">
                <div className="w-fit p-6 rounded-lg shadow-md">
                    <div className="max-w-7xl mx-auto text-center mb-6">
                        <h2 className="text-2xl font-bold text-center text-green-800">Liste des utilisateurs</h2>
        
                        {/* Barre de recherche */}
                        <input
                            type="text"
                            placeholder="Rechercher par nom, prénom ou email"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full py-2 px-3 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 mt-6"
                        />
        
                        {/* Tags */}
                        <div className="flex justify-center gap-4">
                            <span className="text-gray-500">Tags :</span>
                            {rolesList.map(role => (
                                <span
                                    key={role.name}
                                    onClick={() => handleTagClick(role)}
                                    className={`cursor-pointer px-2 py-1 rounded ${selectedTag === role ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-gray-400 hover:bg-gray-500 text-white'}`}
                                >
                                    {role.name}
                                </span>
                            ))}
                        </div>
                    </div>
        
                    {/* Grille des comptes ayants des profils */}
                    {filteredAccountsAndProfilesByTags.length > 0 && (
                        <>
                            <h2 className="text-2xl font-bold text-green-800 mb-2">Comptes & Profils</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6">
                                {filteredAccountsAndProfilesByTags.map((user: Account) => (
                                    <AddRoleCard
                                        key={user.id}
                                        user={user}
                                        rolesList={rolesList}
                                        openRoleMenu={openRoleMenu}
                                        setOpenRoleMenu={setOpenRoleMenu}
                                        addRoleToUser={addRoleToUser}
                                        removeRoleFromUser={removeRoleFromUser}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Grille des comptes seuls */}
                    {filteredAccountsByTags.length > 0 && !selectedTag.name && (
                        <>
                            <h2 className="text-2xl font-bold text-green-800 mt-4 mb-2">Comptes seuls</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6">
                                {filteredAccountsByTags.map((account: Account) => (
                                    <AddRoleCard
                                        key={account.id}
                                        user={account}
                                        rolesList={rolesList}
                                        openRoleMenu={openRoleMenu}
                                        setOpenRoleMenu={setOpenRoleMenu}
                                        addRoleToUser={addRoleToUser}
                                        removeRoleFromUser={removeRoleFromUser}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    { /* Grille des profils seuls */ }
                    {filteredProfiles.length > 0 && !selectedTag.name && (
                        <>
                            <h2 className="text-2xl font-bold text-green-800 mt-4 mb-2">Profils seuls</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6">
                                {filteredProfiles.map((profile: Profile) => (
                                    <AddRoleCard
                                        key={profile.id}
                                        user={profile}
                                        rolesList={rolesList}
                                        openRoleMenu={openRoleMenu}
                                        setOpenRoleMenu={setOpenRoleMenu}
                                        addRoleToUser={addRoleToUser}
                                        removeRoleFromUser={removeRoleFromUser}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Aucun utilisateur */}
                    {filteredAccountsAndProfilesByTags.length === 0 && (
                        <div className="text-center text-gray-500 mt-6">Aucun utilisateur trouvé.</div>
                    )}        

                    {/* Notification */}
                    {showNotification && <Notification message={notification.message} type={notification.type} />}
                </div>
            </div>
        );
}

export default AddRole;