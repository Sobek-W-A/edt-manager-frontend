import React, { useState, useEffect } from "react";
import AddRoleCard from "../Components/AddRole/AddRoleCard";
import Notification from "../Components/AddRole/AddRolePopUp";
import UserApi from "../scripts/API/ModelAPIs/UserAPI";
import { UserType } from "../scripts/API/APITypes/Users.ts";
import APIResponse from "../scripts/API/Responses/APIResponse.ts";

const rolesList = [
    "Responsable de département",
    "Responsable de formation",
    "Secrétariat pédagogique",
    "Enseignant"
];

const usersList: UserType[] = [];


const AddRole:React.FC = () => {
    const [users, setUsers] = useState(usersList);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [openRoleMenu, setOpenRoleMenu] = useState(null);
    const [notification, setNotification] = useState({ message: '', color: '' });
    const [showNotification, setShowNotification] = useState(false);


    // Utilisation de useEffect pour récupérer les utilisateurs
    useEffect(() => {
        UserApi.getAllUsers().then((response: APIResponse<UserType[]>) => {
            if (response.isError()) {
                setNotification({ message: `Une erreur est survenue : ${response.errorMessage()}.`, color: 'red' });
                setShowNotification(true);
            } else {
                setUsers(response.responseObject());
            }
        });
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    /*const toggleRole = (role: string) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(selectedRole => selectedRole !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };*/

    /*const handleRoleChange = (user: UserType, selectedRole: string) => {
        console.log("User Add : " + user.lastname + " " + user.firstname + " - Role : " + selectedRole);
        setUsers(prevUsers =>
            prevUsers.map(userTmp =>
                userTmp.id === user.id
                    ? {
                        ...userTmp,
                        //roles: userTmp.roles.includes(selectedRole) ? userTmp.roles : [...userTmp.roles, selectedRole]
                    }
                    : userTmp
            )
        );
        setOpenRoleMenu(null);

        // Afficher la notification d'ajout de rôle
        setNotification({ message: `Rôle "${selectedRole}" ajouté à ${user.firstname} ${user.lastname}.`, color: 'green' });
        setShowNotification(true); // Affiche la notification
    };*/

    /*const removeRoleFromUser = (user: UserType, roleToRemove: string) => {
        console.log("User Remove : " + user.lastname + " " + user.firstname + " - Role : " + roleToRemove);
        setUsers(prevUsers =>
            prevUsers.map(userTmp =>
                userTmp.id === user.id
                    ? {
                        ...userTmp,
                        //roles: userTmp.roles.filter(role => role !== roleToRemove)
                    }
                    : userTmp
            )
        );

        // Affiche la notification de rôle retiré
        setNotification({ message: `Rôle "${roleToRemove}" retiré à ${user.firstname} ${user.lastname}.`, color: 'red' });
        setShowNotification(true);
    };*/

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.lastname.toLowerCase().includes(searchTerm) ||
            user.firstname.toLowerCase().includes(searchTerm) ||
            user.mail.toLowerCase().includes(searchTerm);

        //const matchesRoles = selectedRoles.length === 0 || selectedRoles.every(role => user.roles.includes(role));

        return matchesSearch /*&& matchesRoles*/;
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
                    className="w-full py-2 px-3 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                />

                {/* Système de tags pour les rôles */}
                <div className="flex flex-wrap justify-center gap-2">
                    <h3 className="text-xl font-semibold text-green-800">Tags : </h3>
                    {rolesList.map((role, index) => (
                        <span
                            key={index}
                            className={`cursor-pointer px-4 py-2 rounded ${selectedRoles.includes(role) ? 'bg-green-800 text-white hover:bg-green-900' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            /*onClick={() => toggleRole(role)}*/
                        >
                            {role}
                        </span>
                    ))}
                </div>
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
                        /*handleRoleChange={handleRoleChange}
                        removeRoleFromUser={removeRoleFromUser}*/
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
