import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

const AddRoleCard = ({ user, rolesList, openRoleMenu, setOpenRoleMenu, handleRoleChange, removeRoleFromUser }) => {
  return (
    <div key={user.id} className="border p-4 rounded shadow-md relative flex justify-between bg-white">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{user.firstname} {user.lastname}</h3>
        <p className="text-gray-500"><FontAwesomeIcon icon={faEnvelope} /> {user.mail}</p>

          <button
              className="bg-green-800 text-white hover:bg-green-900 px-2 py-1 my-2 rounded flex items-center gap-2"
              onClick={() => setOpenRoleMenu(user.id === openRoleMenu ? null : user.id)}
          >
              <FontAwesomeIcon icon={faPlus} />
              Ajouter un rôle
          </button>

        {/* Bouton jouter un rôle */}
        <Link
          className="bg-green-800 text-white hover:bg-green-900 px-2 py-1 my-2 rounded flex items-center gap-2"
         to={"/modify/"+user.id}>
          Modifier l'utilisateur
        </Link>


        {/* Menu déroulant des rôles */}
        {openRoleMenu === user.id && (
          <div className="absolute mt-2 bg-white p-3 rounded border shadow z-10 left-0">
            {rolesList.map((role, index) => (
              <div
                key={index}
                className="cursor-pointer p-2 hover:bg-gray-200 rounded"
                /*onClick={() => handleRoleChange(user, role)}*/
              >
                {role}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rôles attribués, à droite */}
      <div className="ml-4">
        <p className="font-medium">Rôles attribués :</p>
        <ul className="mb-4">
          {/*user.roles.length > 0 ? (
            user.roles.map((role, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-200 px-3 py-1 rounded mb-2">
                {role}
                <span
                  className="cursor-pointer text-red-500"
                  onClick={() => removeRoleFromUser(user, role)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">aucun</li>
          )*/}
        </ul>
      </div>
    </div>
  );
};

export default AddRoleCard;