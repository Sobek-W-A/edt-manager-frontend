import React, { useState, useEffect } from "react";
import AddRoleCard from "../Components/AddRole/AddRoleCard";
import Notification from "../Components/AddRole/AddRolePopUp";
import AccountAPI from "../scripts/API/ModelAPIs/AccountAPI";
import RoleAPI from "../scripts/API/ModelAPIs/RoleAPI";
import APIResponse from "../scripts/API/Responses/APIResponse.ts";
import { Account } from "../scripts/API/APITypes/Accounts.ts";
import { Profile } from "../scripts/API/APITypes/Profiles.ts";
import { ConfirmationMessage } from "../scripts/API/APITypes/CommonTypes";
import ProfileAPI from "../scripts/API/ModelAPIs/ProfileAPI.ts";


function AddRole() {
    const [users, setUsers] = useState<(Account & Profile)[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openRoleMenu, setOpenRoleMenu] = useState<string | null>(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showNotification, setShowNotification] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [rolesList, setRolesList] = useState<string[]>([]);


    // Utilisation de useEffect pour récupérer les comptes, les profils et les rôles
    useEffect(() => {
        const fetchData = async () => {
            const accountResponse = await AccountAPI.getAllAccounts();
            if (accountResponse.isError()) {
                setNotification({ message: `Une erreur est survenue : ${accountResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                console.log("Comptes : ", accountResponse.responseObject());
                const profileResponse = await ProfileAPI.getAllProfiles();
                if (profileResponse.isError()) {
                    setNotification({ message: `Une erreur est survenue : ${accountResponse.errorMessage()}.`, type: 'alert-error' });
                    setShowNotification(true);
                } else {
                    console.log("Profils : ", profileResponse.responseObject());
                    /*const combinedUsers = accountResponse.responseObject().map((account, index) => ({
                        ...account,
                        ...profileResponse.responseObject()[index]
                    }));
                    setUsers(combinedUsers);*/
                }
            }

            const rolesResponse = await RoleAPI.getAllRoles();
            if (rolesResponse.isError()) {
                setNotification({ message: `Une erreur est survenue : ${rolesResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                const roleNames = rolesResponse.responseObject().map((role: { name: string }) => role.name);
                setRolesList(roleNames);
                console.log("Rôles : ", roleNames);
            }

            /*const roleResponse = await RoleAPI.getRoles();
            if (roleResponse.isError()) {
                setNotification({ message: `Une erreur est survenue : ${roleResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                const uniqueRoles = Array.from(new Set(roleResponse.responseObject()));
                setRolesList(uniqueRoles);
            }*/
        };

        fetchData().then();
    }, []);

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

    const handleTagClick = (tag: string) => {
        setSelectedTags(prevTags =>
            prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
        );
    };

    const addRoleToUser = (user: UserType, selectedRole: string) => {
        setUsers(prevUsers =>
            prevUsers.map(userTmp =>
                userTmp.id === user.id
                    ? {
                        ...userTmp,
                        roles : (RoleAPI.addRoleToUser(user.id, selectedRole).then((response: APIResponse<{ roles: string[], message: ConfirmationMessage }>) => {
                            if (response.isError()) {
                                setNotification({ message: `Une erreur est survenue : ${response.errorMessage()}.`, type: 'alert-error' });
                                setShowNotification(true);
                            } else {
                                setNotification({ message: `Rôle "${selectedRole}" ajouté à ${user.firstname} ${user.lastname}.`, type: 'alert-success' });
                                setShowNotification(true);
                                return response.responseObject().roles;
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

    const removeRoleFromUser = (user: UserType, roleToRemove: string) => {
        setUsers(prevUsers =>
            prevUsers.map(userTmp =>
                userTmp.id === user.id
                    ? {
                        ...userTmp,
                        roles : (RoleAPI.removeRoleFromUser(user.id, roleToRemove).then((response: APIResponse<{ roles: string[], message: ConfirmationMessage }>) => {
                            if (response.isError()) {
                                setNotification({ message: `Une erreur est survenue : ${response.errorMessage()}.`, type: 'alert-error' });
                                setShowNotification(true);
                            } else {
                                setNotification({ message: `Rôle "${roleToRemove}" retiré à ${user.firstname} ${user.lastname}.`, type: 'alert-succes' });
                                setShowNotification(true);
                                return response.responseObject().roles;
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

    const filteredUsersByTags = selectedTags.length > 0
        ? filteredUsers.filter(user => selectedTags.every(tag => user.roles.includes(tag)))
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
                                    key={role}
                                    onClick={() => handleTagClick(role)}
                                    className={`cursor-pointer px-2 py-1 rounded ${selectedTags.includes(role) ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-gray-400 hover:bg-gray-500 text-white'}`}
                                >
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
        
                    {/* Grille des utilisateurs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredUsersByTags.map((user) => (
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
                </div>
            </div>
        );
}

export default AddRole;
