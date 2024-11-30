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
import { RoleType } from "../scripts/API/APITypes/Role.ts";


function AddRole() {
    const [users, setUsers] = useState<(Account & Profile)[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openRoleMenu, setOpenRoleMenu] = useState<string | null>(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showNotification, setShowNotification] = useState(false);
    const [selectedTags, setSelectedTags] = useState<RoleType[]>([]);

    const [rolesList, setRolesList] = useState<RoleType[]>([]);


    // Utilisation de useEffect pour récupérer les comptes, les profils et les rôles
    useEffect(() => {
        const fetchData = async () => {
            const accountResponse = await AccountAPI.getAllAccounts();
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

    const handleTagClick = (tag: RoleType) => {
        setSelectedTags(prevTags =>
            prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
        );
    };

    const addRoleToUser = (user: Account & Profile, selectedRole: RoleType) => {
        setUsers((prevUsers: (Account & Profile)[]) =>
            prevUsers.map((userTmp: Account & Profile) =>
            userTmp.id === user.id
                ? {
                    ...userTmp,
                    role: (RoleAPI.modifyUserRole(user.id, selectedRole, user.academic_year.toString()).then((response: APIResponse<RoleType>) => {
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

    const removeRoleFromUser = (user: Account & Profile, roleToRemove: RoleType) => {
        setUsers(prevUsers =>
            prevUsers.map(userTmp =>
                userTmp.id === user.id
                    ? {
                        ...userTmp,
                        roles : (RoleAPI.modifyUserRole(user.id, "", user.academic_year.toString()).then((response: APIResponse<RoleType>) => {
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
                                    key={role.name}
                                    onClick={() => handleTagClick(role)}
                                    className={`cursor-pointer px-2 py-1 rounded ${selectedTags.includes(role) ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-gray-400 hover:bg-gray-500 text-white'}`}
                                >
                                    {role.name}
                                </span>
                            ))}
                        </div>
                    </div>
        
                    {/* Grille des utilisateurs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
