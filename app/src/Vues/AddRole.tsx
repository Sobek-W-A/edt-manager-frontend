import React, { useState, useEffect } from "react";
import AddRoleCard from "../Components/AddRole/AddRoleCard";
import Notification from "../Components/AddRole/AddRolePopUp";
import AccountAPI from "../scripts/API/ModelAPIs/AccountAPI";
import RoleAPI from "../scripts/API/ModelAPIs/RoleAPI";
import APIResponse from "../scripts/API/Responses/APIResponse.ts";
import { Account } from "../scripts/API/APITypes/Accounts.ts";
import { Profile } from "../scripts/API/APITypes/Profiles.ts";
import ProfileAPI from "../scripts/API/ModelAPIs/ProfileAPI.ts";
import { RoleType } from "../scripts/API/APITypes/Role.ts";


function AddRole() {
    const [users, setUsers] = useState<(Account & Profile)[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openRoleMenu, setOpenRoleMenu] = useState<string | null>(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showNotification, setShowNotification] = useState(false);
    const [selectedTag, setSelectedTag] = useState<RoleType>({} as RoleType);
    const [userRoles, setUserRoles] = useState<{ user: Profile & Account, role: RoleType }[]>([]);
    const [rolesList, setRolesList] = useState<RoleType[]>([]);

    const ACADEMIC_YEAR = "2024"; // ATTENTION -> A MODIFIER


    // Utilisation de useEffect pour récupérer les comptes, les profils et les rôles
    useEffect(() => {
        const fetchData = async () => {
            // Récupérer les comptes et les profils de chaque utilisateur
            const accountResponse = await AccountAPI.getAllAccounts();
            console.table(accountResponse.responseObject());
            if (accountResponse.isError()) {
                setNotification({ message: `Une erreur est survenue : ${accountResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                const profileResponse = await ProfileAPI.getAllProfiles();
                if (profileResponse.isError()) {
                    setNotification({ message: `Une erreur est survenue : ${accountResponse.errorMessage()}.`, type: 'alert-error' });
                    setShowNotification(true);
                } else {
                    const combinedUsers = accountResponse.responseObject().map((account, index) => ({
                        ...account,
                        ...profileResponse.responseObject()[index]
                    }));
                    setUsers(combinedUsers);
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
    }, []);

    // Utilisation de useEffect pour récupérer les rôles de chaque utilisateur
    useEffect(() => {
        const fetchUserRoles = async () => {
            const updatedUserRoles = [];
            for (let i = 0; i < users.length; i++) {
                const userRolesResponse = await RoleAPI.getUserRoles(users[i].id, users[i].academic_year.toString());
                if (userRolesResponse.isError()) {
                    setNotification({ message: `Une erreur est survenue : ${userRolesResponse.errorMessage()}.`, type: 'alert-error' });
                    setShowNotification(true);
                    updatedUserRoles.push({ user: users[i], role: {} as RoleType });
                } else {
                    updatedUserRoles.push({ user: users[i], role: userRolesResponse.responseObject() });
                }
            }
            setUserRoles(updatedUserRoles);
        };

        if (users.length > 0) {
            fetchUserRoles().then();
        }
    }, [users]);
    
    // Utilisation de useEffect pour fermer la notification après 3 secondes
    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
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
    const addRoleToUser = (user: Account & Profile, selectedRole: RoleType) => {
        setUsers((prevUsers: (Account & Profile)[]) =>
            prevUsers.map((userTmp: Account & Profile) =>
            userTmp.id === user.id
                ? {
                    ...userTmp,
                    role: (RoleAPI.modifyUserRole(user.id, selectedRole, ACADEMIC_YEAR).then((response: APIResponse<RoleType>) => {
                        if (response.isError()) {
                            setNotification({ message: `Une erreur est survenue : ${response.errorMessage()}.`, type: 'alert-error' });
                            setShowNotification(true);
                        } else {
                            setNotification({ message: `Rôle "${selectedRole}" ajouté à ${user.firstname} ${user.lastname}.`, type: 'alert-success' });
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
        setNotification({ message: `Rôle "${selectedRole}" ajouté à ${user.firstname} ${user.lastname}.`, type: 'alert-success' });
        setShowNotification(true); // Affiche la notification
    };

    // Gestion de la suppression d'un rôle à un utilisateur
    const removeRoleFromUser = (user: Account & Profile, roleToRemove: RoleType) => {
        setUsers(prevUsers =>
            prevUsers.map(userTmp =>
                userTmp.id === user.id
                    ? {
                        ...userTmp,
                        roles : (RoleAPI.modifyUserRole(user.id, {name: "", description: ""}, ACADEMIC_YEAR).then((response: APIResponse<RoleType>) => {
                            if (response.isError()) {
                                setNotification({ message: `Une erreur est survenue : ${response.errorMessage()}.`, type: 'alert-error' });
                                setShowNotification(true);
                            } else {
                                setNotification({ message: `Rôle "${roleToRemove}" retiré à ${user.firstname} ${user.lastname}.`, type: 'alert-success' });
                                setShowNotification(true);
                                return response.responseObject();
                            }
                        }))
                    }
                    : userTmp
            )
        );

        // Affiche la notification de rôle retiré
        setNotification({ message: `Rôle "${roleToRemove}" retiré à ${user.firstname} ${user.lastname}.`, type: 'alert-success' });
        setShowNotification(true);
    };

    const filteredUsers = users.filter(user => {
        return (
            user.lastname.toLowerCase().includes(searchTerm) ||
            user.firstname.toLowerCase().includes(searchTerm) ||
            user.mail.toLowerCase().includes(searchTerm)
        );
    });

    const filteredUsersByTags = selectedTag.name !== undefined
        ? filteredUsers.filter(user => userRoles.some(u => u.user.id === user.id && u.role.name === selectedTag.name))
        : filteredUsers;

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
        
                    {/* Grille des utilisateurs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredUsersByTags.map((user: Account & Profile) => (
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

                    {/* Aucun utilisateur */}
                    {filteredUsersByTags.length === 0 && (
                        <div className="text-center text-gray-500 mt-6">Aucun utilisateur trouvé.</div>
                    )}        

                    {/* Notification */}
                    {showNotification && <Notification message={notification.message} type={notification.type} />}
                </div>
            </div>
        );
}

export default AddRole;
