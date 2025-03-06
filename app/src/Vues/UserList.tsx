import React, { useState, useEffect } from "react";
import UserCard from "../Components/UserList/UserCard.tsx";
import Notification from "../Components/Utils/PopUpAlert.tsx";
import AccountAPI from "../scripts/API/ModelAPIs/AccountAPI.ts";
import RoleAPI from "../scripts/API/ModelAPIs/RoleAPI.ts";
import APIResponse from "../scripts/API/Responses/APIResponse.ts";
import { Account } from "../scripts/API/APITypes/Accounts.ts";
import { Profile } from "../scripts/API/APITypes/Profiles.ts";
import { RoleType } from "../scripts/API/APITypes/Role.ts";
import ProfileAPI from "../scripts/API/ModelAPIs/ProfileAPI.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMagnifyingGlass, faArrowUpAZ, faArrowUp19, faSort, faArrowDownZA, faArrowDown91 } from "@fortawesome/free-solid-svg-icons";


function AddRole() {
    const [accountsAndProfils, setAccountsAndProfils] = useState<(Account)[]>([]);
    const [filteredAccountsAndProfiles, setFilteredAccountsAndProfiles] = useState<(Account)[]>([]);

    const [profiles, setProfiles] = useState<(Profile)[]>([]);
    const [filteredProfiles, seFilteredProfiles] = useState<(Profile)[]>([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showNotification, setShowNotification] = useState(false);

    const [selectedTag, setSelectedTag] = useState<RoleType>({} as RoleType);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const [userRoles, setUserRoles] = useState<{ user: Account, role: RoleType }[]>([]);
    const [rolesList, setRolesList] = useState<RoleType[]>([]);

    const [numberOfAccounts, setNumberOfAccounts] = useState<number>(0);
    const [numberOfProfiles, setNumberOfProfiles] = useState<number>(0);

    const [nbOfItemsPerPage, setNbOfItemsPerPage] = useState<number>(12);
    const [nbOfPage, setNbOfPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [filterAccount, setFilterAccount] = useState<string>("id");
    const [filterProfile, setFilterProfile] = useState<string>("id");

    const [showAccounts, setShowAccounts] = useState<boolean>(true);
    const [showProfiles, setShowProfiles] = useState<boolean>(false);
    const[isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);

    const [userConnected, setUserConnected] = useState<Profile>({} as Profile);

    const [filterOptions, setFilterOptions] = useState<String[]>(showAccounts ? ['Id', 'Login'] : ['Id', 'Prénom', 'Nom', 'Mail']);

    const [ACADEMIC_YEAR, setACADEMIC_YEAR] = useState<string>(window.sessionStorage.getItem("academic_year") || new Date().getFullYear().toString()) //2024

    // Utilisation de useEffect pour récupérer l'année académique lorsqu'elle change dans le session storage
    useEffect(() => {
        const handleSessionStorageChange = () => {
            const academicYear = window.sessionStorage.getItem("academic_year");
            if (academicYear) {
                setACADEMIC_YEAR(academicYear);
            }
        };

        const originalSetItem = sessionStorage.setItem;
        sessionStorage.setItem = function (key, value) {
            originalSetItem.apply(this, arguments);
            handleSessionStorageChange();
        };

        return () => {
            sessionStorage.setItem = originalSetItem;
        };
    }, []);

    // Utilisation de useEffect pour récupérer le nombre de comptes, de profils et les rôles
    useEffect(() => {
        const fetchData = async () => {
            // Si la barre de recherche est vide
            if (searchTerm === "") {
                // Récupere le nombre de profils seuls et de comptes liés à des profils
                const profileNumber = await ProfileAPI.getNumberOfProfiles();
                if (profileNumber.isError()) {
                    setNotification({ message: `Erreur dans le nombre de comptes et profils : ${profileNumber.errorMessage()}.`, type: 'alert-error' });
                    setShowNotification(true);
                } else {
                    setNumberOfAccounts(profileNumber.responseObject().number_of_profiles_with_account);
                    setNumberOfProfiles(profileNumber.responseObject().number_of_profiles_without_account + profileNumber.responseObject().number_of_profiles_with_account);
                }

                fetchAccountsAndProfiles();
            }

            // Récupérer la liste des rôles
            const rolesResponse = await RoleAPI.getAllRoles();
            if (rolesResponse.isError()) {
                setNotification({ message: `Erreur dans la récuperation des rôles : ${rolesResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                setRolesList(rolesResponse.responseObject());
            }

            // Récupére l'utilisateur connecté
            const userConnectedResponse = await ProfileAPI.getCurrentProfile();
            if (userConnectedResponse.isError()) {
                setNotification({ message: `Erreur dans la récuperation de l'utilisateur connecté : ${userConnectedResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                setUserConnected(userConnectedResponse.responseObject());
            }
        };

        fetchData().then();
    }, [ACADEMIC_YEAR, searchTerm, nbOfItemsPerPage]);

    // Utilisation de useEffect pour récupérer les rôles de chaque utilisateur
    useEffect(() => {
        const fetchUserRoles = async () => {
            const updatedUserRoles = [];
            for (let i = 0; i < accountsAndProfils.length; i++) {
                const userRolesResponse = await RoleAPI.getUserRoles(accountsAndProfils[i].id);
                if (userRolesResponse.isError()) {
                    setNotification({ message: `Erreur dans la récuperation des rôles : ${userRolesResponse.errorMessage()}.`, type: 'alert-error' });
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

    // Calculer le nombre de pages
    useEffect(() => {
        if (showAccounts) {
            setNbOfPage(Math.ceil(numberOfAccounts / nbOfItemsPerPage));
        } else if (showProfiles) {
            setNbOfPage(Math.ceil(numberOfProfiles / nbOfItemsPerPage));
        }
    }, [numberOfAccounts, numberOfProfiles, nbOfItemsPerPage, showAccounts, showProfiles]);

    // On mofifie la current page quand on change l'affichage des comptes ou des profils
    useEffect(() => {
        setCurrentPage(1);
    }, [showAccounts, showProfiles]);

    // Utilisation de useEffect pour récupérer les comptes et profils lors du changement de page
    useEffect(() => {
        fetchAccountsAndProfiles();
    }, [currentPage]);

    // Utilisation de useEffect pour récupérer les comptes et profils lors du changement de filtre
    useEffect(() => {
        if (searchTerm === '') {
            fetchAccountsAndProfiles();
        } else {
            handleSearchChange({ target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>);
        }
    }, [filterAccount, filterProfile]);

    // Utilisation de useEffect pour récupérer les comptes et profils lors du changement de nombre d'élements par page ou d'année académique
    useEffect(() => {
        if (searchTerm === '') {
            fetchAccountsAndProfiles();
        } else {
            handleSearchChange({ target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>);
        }
    }, [ACADEMIC_YEAR, nbOfItemsPerPage]);

    // Fonction pour récuperer les comptes et profils
    const fetchAccountsAndProfiles = async () => {
        // Récupérer les comptes liés à des profils
        const accountResponse = await AccountAPI.getAllAccounts(currentPage, nbOfItemsPerPage, filterAccount);
        if (accountResponse.isError()) {
            setNotification({ message: `Erreur dans la récuperation des comptes : ${accountResponse.errorMessage()}.`, type: 'alert-error' });
            setShowNotification(true);
        } else {
            setAccountsAndProfils(accountResponse.responseObject().filter((account: Account) => account.profile !== null));
            setFilteredAccountsAndProfiles(accountResponse.responseObject().filter((account: Account) => account.profile !== null));
        }

        // Récupérer la liste des rôles
        const profilesResponse = await ProfileAPI.getAllProfiles(currentPage, nbOfItemsPerPage, filterProfile);
        if (profilesResponse.isError()) {
            setNotification({ message: `Erreur dans la récuperation des profiles : ${profilesResponse.errorMessage()}.`, type: 'alert-error' });
            setShowNotification(true);
        } else {
            const filteredProfiles = profilesResponse.responseObject();
            setProfiles(filteredProfiles);
            seFilteredProfiles(filteredProfiles);
        }
    };

    // Gestion de la recherche
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());

        // On remet automatiquement la page courante à 1
        setCurrentPage(1);

        // On récupère les mots-clés de la recherche
        const keywords = e.target.value.toLowerCase();

        // Recherche des comptes & profiles, et comptes seuls par mots-clés
        if (keywords !== "" && showAccounts) {
            AccountAPI.searchAccountsByKeywords(keywords, currentPage, nbOfItemsPerPage, filterAccount).then((accountsByKeywords) => {
                if (accountsByKeywords.isError()) {
                    setNotification({ message: `Erreur dans la récuperation des comptes : ${accountsByKeywords.errorMessage()}.`, type: 'alert-error' });
                    setShowNotification(true);
                } else {
                    // On filtre les comptes ayant des profils et les comptes seuls
                    const accountsWithProfiles = accountsByKeywords.responseObject().filter((account: Account) => account.profile !== null);
                    setFilteredAccountsAndProfiles(accountsWithProfiles);
                    setNumberOfAccounts(accountsWithProfiles.length);

                }
            });
        } else {
            setFilteredAccountsAndProfiles(accountsAndProfils);
            setNumberOfAccounts(accountsAndProfils.length);
        }

        // Recherche des profils seuls par mots-clés
        if (keywords !== "" && showProfiles) {
            ProfileAPI.searchProfilesByKeywords(keywords, currentPage, nbOfItemsPerPage, filterProfile).then((profilesByKeywords) => {
                if (profilesByKeywords.isError()) {
                    setNotification({ message: `Erreur dans la récuperation des profiles : ${profilesByKeywords.errorMessage()}.`, type: 'alert-error' });
                    setShowNotification(true);
                } else {
                    const profilesWithoutAccounts = profilesByKeywords.responseObject();
                    seFilteredProfiles(profilesWithoutAccounts);
                    setNumberOfProfiles(profilesWithoutAccounts.length);
                }
            });
        } else {
            const profilesWithoutAccounts = profiles.filter(profile => !accountsAndProfils.some(acc => acc.profile?.id === profile.id));
            seFilteredProfiles(profilesWithoutAccounts);
            setNumberOfProfiles(profilesWithoutAccounts.length);
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
                    role: (RoleAPI.modifyUserRole(user.id, selectedRole, ACADEMIC_YEAR || '').then((response: APIResponse<RoleType>) => {
                        if (response.isError()) {
                            setNotification({ message: `Erreur lors de la modification d'un utilisateur : ${response.errorMessage()}.`, type: 'alert-error' });
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
                        roles : (RoleAPI.removeUserRole(user.id, ACADEMIC_YEAR || '').then((response: APIResponse<undefined>) => {
                            if (response.isError()) {
                                setNotification({ message: `Erreur lors de la suppresion d'un rôle: ${response.errorMessage()}.`, type: 'alert-error' });
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

    const [selectedFilters, setSelectedFilters] = useState<string>("id");
    const [orderType, setOrderType] = useState<'asc' | 'desc'>('asc');

    function handleFilterChange(): void {
        let order = "";
        if (orderType === 'desc') {
            order = "-";
        }

        switch (selectedFilters) {
            case 'Id':
                setFilterAccount(order + 'id');
                setFilterProfile(order + 'id');
                break;
            case 'Login':
                setFilterAccount(order + 'login');
                setFilterProfile(order + 'id');
                break;
            case 'Prénom':
                setFilterAccount(order + 'id');
                setFilterProfile(order + 'firstname');
                break;
            case 'Nom':
                setFilterAccount(order + 'id');
                setFilterProfile(order + 'lastname');
                break;
            case 'Mail':
                setFilterAccount(order + 'id');
                setFilterProfile('mail');
                break;
            default:
                setFilterAccount(order + 'id');
                setFilterProfile(order + 'id');
        }
    }

    // On affiche les comptes liés par défaut ou si le checkbo n'est pas coché, si il est coché on affiche les profiles
    useEffect(() => {
        if (isCheckboxChecked) {
            setShowAccounts(false);
            setShowProfiles(true);
            setSearchTerm("");
            setFilterOptions(['Id', 'Prénom', 'Nom', 'Mail']);
        } else {
            setShowAccounts(true);
            setShowProfiles(false);
            setSearchTerm("");
            setFilterOptions(['Id', 'Login']);
        }

        // On réinitialise les filtres et tags
        setSelectedFilters("id");
        setOrderType('asc');
        setShowFilterMenu(false);
        setSelectedTag({} as RoleType);
    }, [isCheckboxChecked]);

        return (
            <div className="flex justify-center mt-6">
                <div className="w-fit p-6 rounded-lg shadow-md">
                    <div className="max-w-7xl mx-auto text-center mb-6">
                        <h2 className="text-2xl font-bold text-center text-green-800">Liste des utilisateurs</h2>

                        {/* Checkbox pour switch entre les comptes liés et profiles seuls */}
                        <div className="flex gap-4 mb-4">
                            <label htmlFor="accounts" className="text-gray-500">Profils liés à un compte</label>
                            <input type="checkbox" checked={isCheckboxChecked} className="toggle border-green-500 bg-green-500 checked:bg-green-800 checked:text-green-800 checked:border-green-800 " onChange={() => setIsCheckboxChecked(prev => !prev)} />
                            <label htmlFor="profiles" className="text-gray-500">Profils</label>
                        </div>
        
                        <div className="relative mt-6 mb-4">
                            <input
                                type="text"
                                placeholder="Rechercher par nom, prénom ou email"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full py-2 px-3 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
                            />
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                            <FontAwesomeIcon 
                                icon={faFilter} 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700 cursor-pointer" 
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                            />

                            {showFilterMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-10">
                                    <div className="p-2 border-b">
                                        <span className="font-bold text-gray-700">Ordonner par</span>
                                        <FontAwesomeIcon 
                                            icon={faSort} 
                                            className="mr-2 ml-2 text-green-500 hover:text-green-700 cursor-pointer" 
                                            onClick={() => setOrderType(orderType === 'asc' ? 'desc' : 'asc')}
                                            title="Modifier l'ordre"
                                        />
                                    </div>
                                    {filterOptions.map(option => (
                                        <div key={option} className="flex items-center p-2">
                                            {orderType === 'asc' && (
                                                <FontAwesomeIcon 
                                                    icon={(() => {
                                                        switch (option) {
                                                            case 'Id':
                                                                return faArrowUp19;
                                                            case 'Login':
                                                                return faArrowUpAZ;
                                                            case 'Prénom':
                                                                return faArrowUpAZ;
                                                            case 'Nom':
                                                                return faArrowUpAZ;
                                                            case 'Mail':
                                                                return faArrowUpAZ;
                                                            default:
                                                                return faFilter;
                                                        }
                                                    })()} 
                                                    className="mr-2 text-green-500" 
                                                />
                                            )}
                                            {orderType === 'desc' && (
                                                <FontAwesomeIcon 
                                                    icon={(() => {
                                                        switch (option) {
                                                            case 'Id':
                                                                return faArrowDown91;
                                                            case 'Login':
                                                                return faArrowDownZA;
                                                            case 'Prénom':
                                                                return faArrowDownZA;
                                                            case 'Nom':
                                                                return faArrowDownZA;
                                                            case 'Mail':
                                                                return faArrowDownZA;
                                                            default:
                                                                return faFilter;
                                                        }
                                                    })()} 
                                                    className="mr-2 text-green-500" 
                                                />
                                            )}
                                            <input
                                                type="radio"
                                                checked={selectedFilters.includes(option)}
                                                onChange={() => setSelectedFilters(option)}
                                                className="mr-2"
                                            />
                                            <span>{option}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between p-2">
                                        <button
                                            onClick={() => {
                                                setSelectedFilters("id");
                                                setOrderType('asc');
                                                setFilterAccount('id');
                                                setFilterProfile('id');
                                                setShowFilterMenu(false);
                                            }}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded"
                                        >
                                            Réinitialiser
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleFilterChange();
                                                setShowFilterMenu(false);
                                            }}
                                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded ml-2"
                                        >
                                            Appliquer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        {showAccounts && (
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
                        )}
                    </div>
        
                    {/* Grille des comptes ayants des profils */}
                    {showAccounts && filteredAccountsAndProfilesByTags.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6">
                                {filteredAccountsAndProfilesByTags.map((user: Account) => (
                                    <UserCard
                                        key={user.id}
                                        user={user}
                                        userConnected={userConnected}
                                        rolesList={rolesList}
                                        addRoleToUser={addRoleToUser}
                                        removeRoleFromUser={removeRoleFromUser}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    { /* Grille des profils seuls */ }
                    {showProfiles && filteredProfiles.length > 0 && !selectedTag.name && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6">
                                {filteredProfiles.map((profile: Profile) => (
                                    <UserCard
                                        key={profile.id}
                                        user={profile}
                                        userConnected={userConnected}
                                        rolesList={rolesList}
                                        addRoleToUser={addRoleToUser}
                                        removeRoleFromUser={removeRoleFromUser}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Aucun compte lié */}
                    {(filteredAccountsAndProfilesByTags.length === 0 || (filteredAccountsAndProfilesByTags.length === 0 && selectedTag.name)) && showAccounts && (
                        <div className="text-center text-gray-500 mt-6">Aucun compte lié trouvé.</div>
                    )}     

                    {/* Aucun compte lié */}
                    {(filteredProfiles.length === 0 || filteredAccountsAndProfilesByTags.length === 0) && showProfiles && (
                        <div className="text-center text-gray-500 mt-6">Aucun profile trouvé.</div>
                    )}

                    {/* Notification */}
                    {showNotification && <Notification message={notification.message} type={notification.type} />}

                    {/* Pagination */}
                    {((filteredAccountsAndProfilesByTags.length > 0 && showAccounts) || ((filteredProfiles.length > 0) && !selectedTag.name && showProfiles)) && (
                        <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                                <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">

                                {showAccounts && (
                                    <div>
                                        <p className="text-sm text-gray-700">
                                        Affichage de&nbsp;
                                        <span className="font-medium">{currentPage*nbOfItemsPerPage - nbOfItemsPerPage + 1}</span>
                                        &nbsp;à&nbsp;
                                        <span className="font-medium">{(numberOfAccounts) > currentPage*nbOfItemsPerPage ? currentPage*nbOfItemsPerPage : numberOfAccounts}</span>
                                        &nbsp;sur&nbsp;
                                        <span className="font-medium">{numberOfAccounts}</span>
                                        &nbsp;élements
                                        </p>
                                    </div>
                                )}    

                                {showProfiles && (
                                    <div>
                                        <p className="text-sm text-gray-700">
                                        Affichage de&nbsp;
                                        <span className="font-medium">{currentPage*nbOfItemsPerPage - nbOfItemsPerPage + 1}</span>
                                        &nbsp;à&nbsp;
                                        <span className="font-medium">{(numberOfProfiles) > currentPage*nbOfItemsPerPage ? currentPage*nbOfItemsPerPage : numberOfProfiles}</span>
                                        &nbsp;sur&nbsp;
                                        <span className="font-medium">{numberOfProfiles}</span>
                                        &nbsp;élements
                                        </p>
                                    </div>
                                )}    
                    
                                <div>
                                    <label htmlFor="itemsPerPage" className="text-sm text-gray-700 mr-2">Éléments par page:</label>
                                    <select
                                        id="itemsPerPage"
                                        value={nbOfItemsPerPage}
                                        onChange={(e) => setNbOfItemsPerPage(Number(e.target.value))}
                                        className="py-1 px-2 border rounded"
                                    >
                                        <option value={12}>12</option>
                                        <option value={24}>24</option>
                                        <option value={48}>48</option>
                                    </select>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {[...Array(Math.max(nbOfPage, 1) || 1)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => setCurrentPage(index + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === index + 1 ? 'bg-green-700 text-white' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'} focus:z-20 focus:outline-offset-0`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => {
                                                setCurrentPage(currentPage + 1);
                                                // Récupérer les comptes et profils
                                                fetchAccountsAndProfiles();
                                            }}
                                            disabled={currentPage === nbOfPage}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
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