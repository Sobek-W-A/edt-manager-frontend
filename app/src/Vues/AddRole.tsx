import React, { useState, useEffect } from "react";
import AddRoleCard from "../Components/AddRole/AddRoleCard";
import Notification from "../Components/AddRole/AddRolePopUp";
import UserApi from "../scripts/API/ModelAPIs/UserAPI";
import RoleAPI from "../scripts/API/ModelAPIs/RoleAPI";
import { UserType } from "../scripts/API/APITypes/Users.ts";
import APIResponse from "../scripts/API/Responses/APIResponse.ts";
import { ConfirmationMessage } from "../scripts/API/APITypes/CommonTypes";


function AddRole() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openRoleMenu, setOpenRoleMenu] = useState<string | null>(null);
    const [notification, setNotification] = useState({ message: '', color: '' });
    const [showNotification, setShowNotification] = useState(false);

    const [rolesList, setRolesList] = useState<string[]>([]);


    // Utilisation de useEffect pour récupérer les utilisateurs et les rôles
    useEffect(() => {
        const fetchData = async () => {
            const userResponse = await UserApi.getAllUsers();
            if (userResponse.isError()) {
                setNotification({ message: `Une erreur est survenue : ${userResponse.errorMessage()}.`, color: 'red' });
                setShowNotification(true);
            } else {
                setUsers(userResponse.responseObject());
            }

            const roleResponse = await RoleAPI.getRoles();
            if (roleResponse.isError()) {
                setNotification({ message: `Une erreur est survenue : ${roleResponse.errorMessage()}.`, color: 'red' });
                setShowNotification(true);
            } else {
                const uniqueRoles = Array.from(new Set(roleResponse.responseObject()));
                setRolesList(uniqueRoles);
            }
        };

        fetchData();
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

    const addRoleToUser = (user: UserType, selectedRole: string) => {
        setUsers(prevUsers =>
            prevUsers.map(userTmp =>
                userTmp.id === user.id
                    ? {
                        ...userTmp,
                        roles : (RoleAPI.addRoleToUser(user.id, selectedRole).then((response: APIResponse<{ roles: string[], message: ConfirmationMessage }>) => {
                            if (response.isError()) {
                                setNotification({ message: `Une erreur est survenue : ${response.errorMessage()}.`, color: 'red' });
                                setShowNotification(true);
                            } else {
                                setNotification({ message: `Rôle "${selectedRole}" ajouté à ${user.firstname} ${user.lastname}.`, color: 'green' });
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
        setNotification({ message: `Rôle "${selectedRole}" ajouté à ${user.firstname} ${user.lastname}.`, color: 'green' });
        setShowNotification(true); // Affiche la notification
    };

    const removeRoleFromUser = (user: UserType, roleToRemove: string) => {
        console.log("User Remove : " + user.lastname + " " + user.firstname + " - Role : " + roleToRemove);
        setUsers(prevUsers =>
            prevUsers.map(userTmp =>
                userTmp.id === user.id
                    ? {
                        ...userTmp,
                        roles : (RoleAPI.removeRoleFromUser(user.id, roleToRemove).then((response: APIResponse<{ roles: string[], message: ConfirmationMessage }>) => {
                            if (response.isError()) {
                                setNotification({ message: `Une erreur est survenue : ${response.errorMessage()}.`, color: 'red' });
                                setShowNotification(true);
                            } else {
                                setNotification({ message: `Rôle "${roleToRemove}" retiré à ${user.firstname} ${user.lastname}.`, color: 'green' });
                                setShowNotification(true);
                                return response.responseObject().roles;
                            }
                        }))
                    }
                    : userTmp
            )
        );

        // Affiche la notification de rôle retiré
        setNotification({ message: `Rôle "${roleToRemove}" retiré à ${user.firstname} ${user.lastname}.`, color: 'red' });
        setShowNotification(true);
    };

    const filteredUsers = users.filter(user => {
        return (
            user.lastname.toLowerCase().includes(searchTerm) ||
            user.firstname.toLowerCase().includes(searchTerm) ||
            user.mail.toLowerCase().includes(searchTerm)
        );
    });

    return (
        <div className="w-full p-6">
            <div className="max-w-7xl mx-auto text-center mb-6">
            <h2 className="text-2xl font-bold text-center text-green-800">Ajouter un rôle</h2>

                {/* Barre de recherche */}
                <input
                    type="text"
                    placeholder="Rechercher par nom, prénom ou email"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full py-2 px-3 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 mt-6"
                />
            </div>

            {/* Grille des utilisateurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredUsers.map((user) => (
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

            {/* Notification */}
            {showNotification && (
                <Notification message={notification.message} color={notification.color} />
            )}

        </div>
    );
};

export default AddRole;
