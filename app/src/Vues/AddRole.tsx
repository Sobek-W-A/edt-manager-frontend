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
    const [profiles, setProfiles] = useState<(Profile)[]>([]);
    const [filteredProfiles, seFilteredProfiles] = useState<(Profile)[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openRoleMenu, setOpenRoleMenu] = useState<string | null>(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showNotification, setShowNotification] = useState(false);
    const [selectedTag, setSelectedTag] = useState<RoleType>({} as RoleType);
    const [userRoles, setUserRoles] = useState<{ user: Account, role: RoleType }[]>([]);
    const [rolesList, setRolesList] = useState<RoleType[]>([]);

    const ACADEMIC_YEAR = "2024"; // ATTENTION -> A MODIFIER


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
    }, []);

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
                    setFilteredAccountsAndProfiles(accountsWithProfiles);
                }
            });
        } else {
            setFilteredAccountsAndProfiles(accountsAndProfils);
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
                    {((filteredAccountsAndProfilesByTags.length === 0 && filteredProfiles.length === 0) || (filteredAccountsAndProfilesByTags.length === 0 && selectedTag.name)) && (
                        <div className="text-center text-gray-500 mt-6">Aucun utilisateur trouvé.</div>
                    )}        

                    {/* Notification */}
                    {showNotification && <Notification message={notification.message} type={notification.type} />}

                    {/* Pagination */}
                    {((filteredAccountsAndProfilesByTags.length > 0) || ((filteredProfiles.length > 0) && !selectedTag.name)) && (
                        <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                                <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                <p className="text-sm text-gray-700">
                                    Showing&nbsp;
                                    <span className="font-medium">1</span>
                                    &nbsp;to&nbsp;
                                    <span className="font-medium">10</span>
                                    &nbsp;of&nbsp;
                                    <span className="font-medium">97</span>
                                    &nbsp;results
                                </p>
                                </div>
                                <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <a href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                    <span className="sr-only">Previous</span>
                                    <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
                                    </svg>
                                    </a>
                                    {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                                    <a href="#" aria-current="page" className="relative z-10 inline-flex items-center bg-green-700 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">1</a>
                                    <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">2</a>
                                    <a href="#" className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">3</a>
                                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
                                    <a href="#" className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">8</a>
                                    <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">9</a>
                                    <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">10</a>
                                    <a href="#" className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                    <span className="sr-only">Next</span>
                                    <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                                    </svg>
                                    </a>
                                </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
}

export default AddRole;