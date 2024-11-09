import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {UserType} from "../../scripts/API/APITypes/Users";
import RoleAPI from "../../scripts/API/ModelAPIs/RoleAPI";

interface AddRoleCardProps {
  user: UserType;
  rolesList: string[];
  openRoleMenu: string | null;
  setOpenRoleMenu: (id: string | null) => void;
  addRoleToUser: (user: UserType, role: string) => void;
  removeRoleFromUser: (user: UserType, role: string) => void;
}

function AddRoleCard({ user, rolesList, openRoleMenu, setOpenRoleMenu, addRoleToUser, removeRoleFromUser }: AddRoleCardProps) {
  const [roles, setRoles] = useState<string[]>([]);
  const [userRoles, setUserRoles] = useState<{ id: number, roles: string[] }[]>([]);
  const [notification, setNotification] = useState<{ message: string; color: string } | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const userRolesResponse = await RoleAPI.getUserRoles(user.id);
      if (userRolesResponse.isError()) {
        setNotification({ message: `Une erreur est survenue : ${userRolesResponse.errorMessage()}.`, color: 'red' });
        setShowNotification(true);
        setUserRoles([{ id: user.id, roles: [] }]);
      } else {
        setUserRoles([{ id: user.id, roles: userRolesResponse.responseObject() }]);
      }

      const roleResponse = await RoleAPI.getRoles();
      if (roleResponse.isError()) {
          setNotification({ message: `Une erreur est survenue : ${roleResponse.errorMessage()}.`, color: 'red' });
          setShowNotification(true);
      } else {
          const uniqueRoles = Array.from(new Set(roleResponse.responseObject()));
          setRoles(uniqueRoles);
      }
    };

    fetchData().then();
  }, [user.id, rolesList]);

  const handleAddRole = (user: UserType, role: string) => {
    setUserRoles(prevUserRoles => {
        return prevUserRoles.map(userRole => {
            if (userRole.id === user.id) {
                if (!userRole.roles.includes(role)) {
                    addRoleToUser(user, role);
                    return {...userRole, roles: [...userRole.roles, role]};
                }
            }
            return userRole;
        });
    });
  };

  const handleRemoveRole = (user: UserType, role: string) => {
    removeRoleFromUser(user, role);
    setUserRoles(prevUserRoles => {
        return prevUserRoles.map(userRole => {
            if (userRole.id === user.id) {
                return {...userRole, roles: userRole.roles.filter(r => r !== role)};
            }
            return userRole;
        });
    });
  };

  return (
    <div key={user.id} className="border p-4 rounded shadow-md relative flex justify-between bg-white">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{user.firstname} {user.lastname}</h3>
        <p className="text-gray-500"><FontAwesomeIcon icon={faEnvelope} /> {user.mail}</p>

        {/* Bouton jouter un rôle */}
        <button
          className="bg-green-700 text-white hover:bg-green-900 px-2 py-1 my-2 rounded flex items-center gap-2"
          onClick={() => setOpenRoleMenu(user.id.toString() === openRoleMenu ? null : user.id.toString())}
        >
          <FontAwesomeIcon icon={faPlus} />
          Ajouter un rôle
        </button>

        {/* Menu déroulant des rôles */}
        {openRoleMenu === user.id.toString() && (
          <div className="absolute mt-2 bg-white p-3 rounded border shadow z-10 left-0">
              {rolesList.map((role: string, index: number) => (
                <div key={index} className="flex justify-between items-center bg-gray-200 px-3 py-1 rounded mb-2 hover:bg-gray-300 cursor-pointer"
                  onClick={() => handleAddRole(user, role)}
                >
                  <span>{role}</span>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Rôles attribués, à droite */}
      <div className="ml-2">
        <p className="font-medium">Rôles attribués :</p>
        <ul className="mb-4">
          {
            userRoles.map((userRole, index) => (
              userRole.roles.length > 0 ? (
                userRole.roles.map((role, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-200 px-2 py-1 rounded mb-2">
                    {role}
                    <span
                      className="px-2 cursor-pointer text-red-500"
                      onClick={() => {removeRoleFromUser(user, role); handleRemoveRole(user, role);}}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  </li>
                ))
              ) : (
                <li key={index} className="text-gray-500">aucun</li>
              )
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default AddRoleCard;