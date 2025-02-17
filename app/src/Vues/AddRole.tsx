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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMagnifyingGlass, faArrowUpAZ, faArrowUp19, faSort, faArrowDownZA, faArrowDown91 } from "@fortawesome/free-solid-svg-icons";


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
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const [userRoles, setUserRoles] = useState<{ user: Account, role: RoleType }[]>([]);
    const [rolesList, setRolesList] = useState<RoleType[]>([]);

    const [numberOfAccounts, setNumberOfAccounts] = useState<number>(0);
    const [numberOfProfiles, setNumberOfProfiles] = useState<number>(0);

    const [nbOfItemsPerPage, setNbOfItemsPerPage] = useState<number>(10);
    const [nbOfPage, setNbOfPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [filterAccount, setFilterAccount] = useState<string>("id");
    const [filterProfile, setFilterProfile] = useState<string>("id");

    const ACADEMIC_YEAR = window.sessionStorage.getItem("academic_year") //2024


    // Utilisation de useEffect pour récupérer les comptes, les profils et les rôles
    useEffect(() => {
        const fetchData = async () => {
            // Si la barre de recherche est vide
            if (searchTerm === "") {
                // Récupere le nombre de comptes
                const accountNumber = await AccountAPI.getNumberOfAccounts();
                if (accountNumber.isError()) {
                    setNotification({ message: `Une erreur est survenue : ${accountNumber.errorMessage()}.`, type: 'alert-error' });
                    setShowNotification(true);
                } else {
                    setNumberOfAccounts(accountNumber.responseObject().number_of_elements);
                }

                // Récupere le nombre de profils
                const profileNumber = await ProfileAPI.getNumberOfProfiles(ACADEMIC_YEAR);
                if (profileNumber.isError()) {
                    setNotification({ message: `Une erreur est survenue : ${profileNumber.errorMessage()}.`, type: 'alert-error' });
                    setShowNotification(true);
                } else {
                    setNumberOfProfiles(profileNumber.responseObject().number_of_profiles_without_account);
                }
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
    }, [ACADEMIC_YEAR, nbOfItemsPerPage, numberOfProfiles]);

    // Fonction pour récuperer les comptes et profils
    const fetchAccountsAndProfiles = async () => {
        // Récupérer les comptes liés à des profils
        const accountResponse = await AccountAPI.getAllAccounts(currentPage, nbOfItemsPerPage / 2, filterAccount);
        if (accountResponse.isError()) {
            setNotification({ message: `Une erreur est survenue : ${accountResponse.errorMessage()}.`, type: 'alert-error' });
            setShowNotification(true);
        } else {
            setAccountsAndProfils(accountResponse.responseObject().filter((account: Account) => account.profile !== null));
            setFilteredAccountsAndProfiles(accountResponse.responseObject().filter((account: Account) => account.profile !== null));
        }

        // Récupérer la liste des rôles
        const profilesResponse = await ProfileAPI.getAllProfiles(ACADEMIC_YEAR, currentPage, nbOfItemsPerPage/2, filterProfile);
        if (profilesResponse.isError()) {
            setNotification({ message: `Une erreur est survenue : ${profilesResponse.errorMessage()}.`, type: 'alert-error' });
            setShowNotification(true);
        } else {
            const filteredProfiles = profilesResponse.responseObject().filter((profile: Profile) => profile.account_id === null);
            setProfiles(filteredProfiles);
            seFilteredProfiles(filteredProfiles);
        }
    };

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

        // On remet automatiquement la page courante à 1
        setCurrentPage(1);

        // On récupère les mots-clés de la recherche
        const keywords = e.target.value.toLowerCase();

        // Recherche des comptes & profiles, et comptes seuls par mots-clés
        if (keywords !== "") {
            AccountAPI.searchAccountsByKeywords(keywords, currentPage, nbOfItemsPerPage / 2, filterAccount).then((accountsByKeywords) => {
                if (accountsByKeywords.isError()) {
                    setNotification({ message: `Une erreur est survenue : ${accountsByKeywords.errorMessage()}.`, type: 'alert-error' });
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
        if (keywords !== "") {
            ProfileAPI.searchProfilesByKeywords(keywords, currentPage, nbOfItemsPerPage / 2, filterProfile).then((profilesByKeywords) => {
                if (profilesByKeywords.isError()) {
                    setNotification({ message: `Une erreur est survenue : ${profilesByKeywords.errorMessage()}.`, type: 'alert-error' });
                    setShowNotification(true);
                } else {
                    const profilesWithoutAccounts = profilesByKeywords.responseObject().filter((profile: Profile) => !accountsAndProfils.some(acc => acc.profile?.id === profile.id));
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

    // Calculer le nombre de pages
    useEffect(() => {
        setNbOfPage(Math.ceil((numberOfAccounts + numberOfProfiles) / nbOfItemsPerPage));
    }, [numberOfAccounts, numberOfProfiles, nbOfItemsPerPage]);

    // Utilisation de useEffect pour récupérer les comptes et profils lors du changement de page
    useEffect(() => {
        fetchAccountsAndProfiles();
    }, [currentPage]);

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

    // Utilisation de useEffect pour récupérer les comptes et profils lors du changement de filtre
    useEffect(() => {
        if (searchTerm === '') {
            fetchAccountsAndProfiles();
        } else {
            handleSearchChange({ target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>);
        }
    }, [filterAccount, filterProfile]);

    // Utilisation de useEffect pour récupérer les comptes et profils lors du changement de nombre d'élements par page
    useEffect(() => {
        if (searchTerm === '') {
            fetchAccountsAndProfiles();
        } else {
            handleSearchChange({ target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>);
        }
    }, [nbOfItemsPerPage]);

        return (
            <div className="flex justify-center mt-6">
                <div className="w-fit p-6 rounded-lg shadow-md">
                    <div className="max-w-7xl mx-auto text-center mb-6">
                        <h2 className="text-2xl font-bold text-center text-green-800">Liste des utilisateurs</h2>
        
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
                                        <span className="font-bold text-gray-700">Filtrer par</span>
                                        <FontAwesomeIcon 
                                            icon={faSort} 
                                            className="mr-2 ml-2 text-green-500 hover:text-green-700 cursor-pointer" 
                                            onClick={() => setOrderType(orderType === 'asc' ? 'desc' : 'asc')}
                                            title="Modifier l'ordre"
                                        />
                                    </div>
                                    {['Id', 'Login', 'Prénom', 'Nom', 'Mail'].map(option => (
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
                        <div className="flex justify-center gap-4 mt-4"></div>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
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
                                    Affichage de&nbsp;
                                    <span className="font-medium">{currentPage*nbOfItemsPerPage - nbOfItemsPerPage + 1}</span>
                                    &nbsp;à&nbsp;
                                    <span className="font-medium">{(numberOfAccounts + numberOfProfiles) > currentPage*nbOfItemsPerPage ? currentPage*nbOfItemsPerPage : numberOfAccounts + numberOfProfiles}</span>
                                    &nbsp;sur&nbsp;
                                    <span className="font-medium">{numberOfAccounts + numberOfProfiles}</span>
                                    &nbsp;élements
                                </p>
                                </div>
                                <div>
                                    <label htmlFor="itemsPerPage" className="text-sm text-gray-700 mr-2">Éléments par page:</label>
                                    <select
                                        id="itemsPerPage"
                                        value={nbOfItemsPerPage}
                                        onChange={(e) => setNbOfItemsPerPage(Number(e.target.value))}
                                        className="py-1 px-2 border rounded"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
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