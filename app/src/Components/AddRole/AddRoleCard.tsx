import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faPlus,faTimes} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import RoleAPI from "../../scripts/API/ModelAPIs/RoleAPI";
import Account from "../../scripts/API/APITypes/Accounts";
import Profile from "../../scripts/API/APITypes/Profiles";
import {Link} from "react-router-dom";
import { RoleType } from "../../scripts/API/APITypes/Role";

interface AddRoleCardProps {
  user: Account & Profile;
  rolesList: RoleType[];
  openRoleMenu: string | null;
  setOpenRoleMenu: (id: string | null) => void;
  addRoleToUser: (user: Account & Profile, role: RoleType) => void;
  removeRoleFromUser: (user: Account & Profile, role: RoleType) => void;
}

function AddRoleCard({ user, rolesList, openRoleMenu, setOpenRoleMenu, addRoleToUser, removeRoleFromUser }: AddRoleCardProps) {
  const [, setRoles] = useState<RoleType[]>([]);
  const [userRoles, setUserRoles] = useState<{ id: number, roles: RoleType[] }[]>([]);
  const [, setNotification] = useState<{ message: string; type: string } | null>(null);
  const [, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const userRolesResponse = await RoleAPI.getUserRoles(user.id, user.academic_year);
      if (userRolesResponse.isError()) {
        setNotification({ message: `Une erreur est survenue : ${userRolesResponse.errorMessage()}.`, type: 'alert-error' });
        setShowNotification(true);
        setUserRoles([{ id: user.id, roles: [] }]);
      } else {
        setUserRoles([{ id: user.id, roles: userRolesResponse.responseObject() }]);
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
  }, [user.id, user.academic_year, rolesList]);

  const handleAddRole = (user: Account & Profile, role: RoleType) => {
    console.log("Adding role", role, "to user", user);
    addRoleToUser(user, role);
    /*setUserRoles(prevUserRoles => {
        return prevUserRoles.map(userRole => {
            if (userRole === user) {
                if (!userRole.roles.includes(role)) {
                    addRoleToUser(user, role);
                    return {...userRole, roles: [...userRole.roles, role]};
                }
            }
            return userRole;
        });
    });*/
  };

  const handleRemoveRole = (user: Account & Profile, role: RoleType) => {
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
        <details className="dropdown">
          <summary
            className="bg-green-700 text-white hover:bg-green-900 px-2 py-1 my-2 rounded flex items-center gap-2 cursor-pointer"
            onClick={() => setOpenRoleMenu(user.id.toString() === openRoleMenu ? null : user.id.toString())}
          >
            <FontAwesomeIcon icon={faPlus} />
            Ajouter un rôle
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {rolesList.map((role: RoleType, index: number) => (
              <li><a key={index} className="flex justify-between items-center bg-gray-200 px-3 py-1 rounded mb-2 hover:bg-gray-300 cursor-pointer"
                onClick={() => handleAddRole(user, role)}
              >
                <span>{role.name}</span>
              </a></li>
            ))}
          </ul>
        </details>

        {/* Bouton jouter un rôle */}
        <Link
          className="bg-green-800 text-white hover:bg-green-900 px-2 py-1 my-2 rounded flex items-center gap-2"
         to={"/modify/"+user.id}>
          Modifier l'utilisateur
        </Link>
      </div>

      {/* Rôles attribués, à droite */}
      <div className="ml-2">
        <p className="font-medium">Rôles attribués :</p>
        <ul className="mb-4">
          {
            userRoles.map((userRole, index) => (
              userRole.roles.length > 0 ? (
                userRole.roles.map((role: RoleType, index: number) => (
                  <li key={index} className="flex justify-between items-center bg-gray-200 px-2 py-1 rounded mb-2">
                    {role.name}
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