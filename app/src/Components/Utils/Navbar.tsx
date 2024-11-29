import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AuthModel from '../../scripts/Models/AuthModel';
import { useEffect, useState } from 'react';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(AuthModel.isLoggedIn());
    }, []);

    return (
        <div className="w-full bg-green-700 border-b-2 border-t-2 p-2 pb-3 text-xl font-bold text-white grid grid-cols-5 h-[7%]">
            <div className="col-start-1 col-span-1 flex items-center">
                <Link to="/">
                    <span className="ml-2">SOBEK W.A.</span>
                </Link>
            </div>
            {isLoggedIn && (
                <>
                {/* Add Role Links - regroupés et centrés avec un petit espace */}
                <div className="col-start-2 col-span-3 flex justify-center items-center space-x-6">
                    <div className="flex justify-center items-center">
                        <Link to="/accountcreation" className="text-sm hover:text-green-300 transition duration-200">
                            Creer un utilisateur
                        </Link>
                    </div>
                    <div className="flex justify-center items-center">
                        <Link to="/add-role" className="text-sm hover:text-green-300 transition duration-200">
                            Liste d'utilisateurs
                        </Link>
                    </div>
                    <div className="flex justify-center items-center">
                        <Link to="/management" className="text-sm hover:text-green-300 transition duration-200">
                            Gestion des cours
                        </Link>
                    </div>
                </div>
            </>)}

            {!isLoggedIn && (
                <>
                {/* Login Link - déplacé à droite */}
                <div className="col-start-5 col-span-1 flex justify-end items-center">
                    <Link to="/login" className="text-sm hover:text-green-300 transition duration-200">
                        LOGIN
                    </Link>
                </div>
            </>)}

                    {/* Add Role Link */}
                    <div className="col-start-6 col-span-1 flex justify-end items-center">
                        <Link to="/profileCreation" className="text-sm hover:text-green-300 transition duration-200">
                            Créer un profile
                        </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="col-start-10 col-span-1 flex justify-end items-center ml-auto">
                        <button
                            onClick={() => {
                                AuthModel.logout();
                                setIsLoggedIn(false); // Mettez à jour l'état de connexion après la déconnexion
                            }}
                            className="text-sm hover:text-green-300 transition duration-200 flex items-center"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                            Se déconnecter
                        </button>
                    </div>
            )}
        </div>
    );
}

export default Navbar;