import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPlus, faTimes, faEdit, faUserCircle, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import RoleAPI from "../../scripts/API/ModelAPIs/RoleAPI";
import { Account } from "../../scripts/API/APITypes/Accounts";
import { Profile } from "../../scripts/API/APITypes/Profiles";
import { Link } from "react-router-dom";
import { RoleType } from "../../scripts/API/APITypes/Role";

interface AddRoleCardProps {
  user: Account | Profile;
  rolesList: RoleType[];
  addRoleToUser: (user: Account, role: RoleType) => void;
  removeRoleFromUser: (user: Account, role: RoleType) => void;
}

function AddRoleCard({ user, rolesList, addRoleToUser, removeRoleFromUser }: AddRoleCardProps) {
  const [userRoles, setUserRoles] = useState<{ id: number, role: RoleType }[]>([]);
  const [, setNotification] = useState<{ message: string; type: string } | null>(null);
  const [, setShowNotification] = useState<boolean>(false);

  const ROLE_DEFAULT = { name: "Non assigné", description: "Rôle par défaut." } as RoleType;
  const modalId = `role_modal_${user.id}`;

  useEffect(() => {
    const fetchData = async () => {
      if ('profile' in user && user.profile) {
        const userRolesResponse = await RoleAPI.getUserRoles(user.id);
        if (userRolesResponse.isError()) {
          setNotification({ message: `Une erreur est survenue : ${userRolesResponse.errorMessage()}.`, type: 'alert-error' });
          setShowNotification(true);
          setUserRoles([{ id: user.id, role: {} as RoleType }]);
        } else {
          setUserRoles([{ id: user.id, role: userRolesResponse.responseObject() }]);
        }
      }
    };

    fetchData().then();
  }, []);

  const handleAddRole = (user: Account, role: RoleType) => {
    addRoleToUser(user, role);
    setUserRoles(
      userRoles.map((userRole) => {
        if (userRole.id === user.id) {
          return { id: user.id, role: role };
        } else {
          return userRole;
        }
      })
    );
    closeModal();
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
      })
    );
  };

  const openModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    modal?.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    modal?.close();
  };

  return (
    <div key={user.id} className="border p-4 rounded shadow-md relative flex justify-between bg-white hover:shadow-lg hover:scale-105 transition-transform duration-200">
      {/* Bouton de modification */}
      <div className="absolute top-2 right-2">
        <Link to={"/affectation/" + ('profile' in user && user.profile ? user.profile.id : user.id)} title="Voir affectations">
          <FontAwesomeIcon icon={faCalendarDays} className="text-green-500 hover:text-green-700 cursor-pointer text-xl" />
        </Link>
        &nbsp;
        <Link to={"/modify/" + user.id} title="Modifier le compte">
          <FontAwesomeIcon icon={faEdit} className="text-green-500 hover:text-green-700 cursor-pointer text-xl" />
        </Link>
      </div>
      <div>
        {'profile' in user && user.profile ? (
          <h3 className="text-xl font-semibold">
            {user.profile.firstname} {user.profile.lastname}
          </h3>
        ) : (
          <h3 className="text-xl font-semibold">
            {'firstname' in user && user.firstname ? `${user.firstname} ${user.lastname}` : null}
          </h3>
        )}
        {'login' in user && user.login && (
          <p className="text-gray-500"><FontAwesomeIcon icon={faUserCircle} /> {user.login}</p>
        )}
        {'profile' in user && user.profile ? (
          <p className="text-gray-500"><FontAwesomeIcon icon={faEnvelope} /> {user.profile.mail}</p>
        ) : (
          <p className="text-gray-500">
            {'mail' in user && user.mail && <FontAwesomeIcon icon={faEnvelope} />} {user.mail}
          </p>
        )}

        {/* Rôle */}
        { ('profile' in user && user.profile) || ('login' in user && user.login) ? (
          <ul className="w-fit">
            {userRoles.map((userRole, index) => (
              userRole.id !== undefined && userRole.id === user.id && userRole.role.name ? (
                <li key={index} className="flex justify-between items-center bg-gray-200 rounded">
                  <span className="px-2 text-gray-700">
                    {userRole.role.name}
                  </span>
                  <summary
                    className="py-1 my-2 rounded flex items-center cursor-pointer relative"
                    onClick={openModal} // Ouvrir le modal lorsque cliqué
                  >
                    <FontAwesomeIcon icon={faEdit} className="cursor-pointer text-green-500 hover:text-green-700 mx-2" title="Modifier le rôle" />
                  </summary>
                  <FontAwesomeIcon icon={faTimes} className="cursor-pointer text-red-500 hover:text-red-700 me-2" title="Supprimer le rôle" onClick={() => { removeRoleFromUser(user, userRole.role); handleRemoveRole(user, userRole.role); }} />
                </li>
              ) : (
                <li key={user.id} className="flex justify-between items-center text-gray-500">
                  <span>aucun rôle</span>
                  <summary
                    className="py-1 my-2 rounded flex items-center cursor-pointer relative"
                    onClick={openModal} // Ouvrir le modal lorsque cliqué
                  >
                    <FontAwesomeIcon icon={faPlus} className="cursor-pointer text-green-500 hover:text-green-700 ml-2" title="Ajouter un rôle" />
                  </summary>
                </li>
              )
            ))}
          </ul>
        ) : null}
      </div>

      {/* Modal DaisyUI */}
      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Sélectionner un rôle</h3>
          <ul className="space-y-2">
            {rolesList.map((role) => (
              <li key={role.name}>
                <button
                  className="btn w-full bg-green-700 hover:bg-green-900 text-white"
                  onClick={() => handleAddRole(user, role)}
                >
                  {role.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="modal-action">
            <button className="btn bg-gray-300" onClick={closeModal}>Fermer</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default AddRoleCard;
