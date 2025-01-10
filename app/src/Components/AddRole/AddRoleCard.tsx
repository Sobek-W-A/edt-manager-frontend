import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPlus, faTimes, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import RoleAPI from "../../scripts/API/ModelAPIs/RoleAPI";
import { Account } from "../../scripts/API/APITypes/Accounts";
import { Link } from "react-router-dom";
import { RoleType } from "../../scripts/API/APITypes/Role";

interface AddRoleCardProps {
  user: Account;
  rolesList: RoleType[];
  openRoleMenu: string | null;
  setOpenRoleMenu: (id: string | null) => void;
  addRoleToUser: (user: Account, role: RoleType) => void;
  removeRoleFromUser: (user: Account, role: RoleType) => void;
}

function AddRoleCard({ user, rolesList, openRoleMenu, setOpenRoleMenu, addRoleToUser, removeRoleFromUser }: AddRoleCardProps) {
  const [, setRoles] = useState<RoleType[]>([]);
  const [userRoles, setUserRoles] = useState<{ id: number, role: RoleType }[]>([]);
  const [, setNotification] = useState<{ message: string; type: string } | null>(null);
  const [, setShowNotification] = useState<boolean>(false);

  const ROLE_DEFAULT = { name: "Non assigné", description: "Rôle par défaut." } as RoleType;
  const ACADEMIC_YEAR = "2024"; // ATTENTION -> A MODIFIER

  useEffect(() => {
    const fetchData = async () => {
      const userRolesResponse = await RoleAPI.getUserRoles(user.id, ACADEMIC_YEAR);
      if (userRolesResponse.isError()) {
        setNotification({ message: `Une erreur est survenue : ${userRolesResponse.errorMessage()}.`, type: 'alert-error' });
        setShowNotification(true);
        setUserRoles([{ id: user.id, role: {} as RoleType }]);
      } else {
        setUserRoles([{ id: user.id, role: userRolesResponse.responseObject() }]);
      }

      const roleResponse = await RoleAPI.getAllRoles();
      if (roleResponse.isError()) {
        setNotification({ message: `Une erreur est survenue : ${roleResponse.errorMessage()}.`, type: 'alert-error' });
        setShowNotification(true);
      } else {
        setRoles(roleResponse.responseObject());
      }
    };

    fetchData().then();
  }, [user.id, rolesList]);

  const handleAddRole = (user: Account, role: RoleType) => {
    addRoleToUser(user, role);
    setUserRoles(
      userRoles.map((userRole) => {
        if (userRole.id === user.id) {
          return { id: user.id, role: role };
        } else {
          return userRole;
        }
      }
    ));
  };

  const handleRemoveRole = (user: Account, role: RoleType) => {
    removeRoleFromUser(user, role);
    setUserRoles(
      userRoles.map((userRole) => {
        if (userRole.id === user.id) {
          return { id: user.id, role: ROLE_DEFAULT };
        } else {
          return userRole;
        }
      }
    ));
  };

  return (
    <div key={user.id} className="border p-4 rounded shadow-md relative flex justify-between bg-white">
      {/* Bouton de modification */}
      <div className="absolute top-2 right-2">
        <Link to={"/modify/" + user.id} title="Modifier le profil">
          <FontAwesomeIcon icon={faEdit} className="text-green-500 hover:text-green-700 cursor-pointer text-xl" />
        </Link>
      </div>
      <div>
        <h3 className="text-xl font-semibold">
          {user.profile.firstname} {user.profile.lastname}
        </h3>
        <p className="text-gray-500"><FontAwesomeIcon icon={faEnvelope} /> {user.profile.mail}</p>

        {/* Rôle */}
        <ul className="w-fit">
          {userRoles.map((userRole, index) => (
            //console.log("Test du role : ", userRole),
            userRole.id !== undefined && userRole.id === user.id && userRole.role.name ? (
              <li key={index} className="flex justify-between items-center bg-gray-200 rounded">
                <span className="px-2 text-gray-700">
                  {userRole.role.name}
                </span>
                <summary
                  className="py-1 my-2 rounded flex items-center cursor-pointer relative"
                  onClick={() => setOpenRoleMenu(user.id.toString() === openRoleMenu ? null : user.id.toString())}
                >
                  <FontAwesomeIcon icon={faEdit} className="cursor-pointer text-green-500 hover:text-green-700 mx-2" title="Modifier le rôle" />
                  {openRoleMenu === user.id.toString() && (
                    <ul className="absolute top-full left-0 menu dropdown-content bg-base-100 rounded z-[1] w-52 p-2 shadow">
                      {rolesList.map((role: RoleType, index: number) => (
                        <li key={role.name}>
                          <a
                            key={index}
                            className="flex justify-between items-center bg-gray-200 px-3 py-1 rounded mb-2 hover:bg-gray-300 cursor-pointer"
                            onClick={() => handleAddRole(user, role)}
                          >
                            <span>{role.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </summary>
                <FontAwesomeIcon icon={faTimes} className="cursor-pointer text-red-500 hover:text-red-700 me-2" title="Supprimer le rôle" onClick={() => { removeRoleFromUser(user, userRole.role); handleRemoveRole(user, userRole.role); }} />
              </li>
            ) : (
              <li key={user.id} className="flex justify-between items-center text-gray-500">
                <span>aucun rôle</span>
                <summary
                  className="py-1 my-2 rounded flex items-center cursor-pointer relative"
                  onClick={() => setOpenRoleMenu(user.id.toString() === openRoleMenu ? null : user.id.toString())}
                >
                  <FontAwesomeIcon icon={faPlus} className="cursor-pointer text-green-500 hover:text-green-700 ml-2" title="Ajouter un rôle" onClick={() => setOpenRoleMenu(user.id.toString() === openRoleMenu ? null : user.id.toString())} />
                  {openRoleMenu === user.id.toString() && (
                    <ul className="absolute top-full left-0 menu dropdown-content bg-base-100 rounded z-[1] w-52 p-2 shadow">
                      {rolesList.map((role: RoleType, index: number) => (
                        <li key={role.name}>
                          <a
                            key={index}
                            className="flex justify-between items-center bg-gray-200 px-3 py-1 rounded mb-2 hover:bg-gray-300 cursor-pointer"
                            onClick={() => handleAddRole(user, role)}
                          >
                            <span>{role.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </summary>
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddRoleCard;