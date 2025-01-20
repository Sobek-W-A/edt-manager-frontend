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
        <div className="w-full bg-green-700 border-b-2 border-t-2 p-2 pb-3 text-xl font-bold text-white flex justify-between items-center">
            <div className="flex items-center">
                <Link to="/">
                    <span className="ml-2">SOBEK W.A.</span>
                </Link>
            </div>

            <div className="flex space-x-6">
                {isLoggedIn && (
                    <>
                        <div className="flex items-center">
                            <Link to="/add-role" className="text-sm hover:text-green-300 transition duration-200">
                                Liste d'utilisateurs
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <Link to="/management" className="text-sm hover:text-green-300 transition duration-200">
                                Gestion des cours
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <Link to="/profileCreation" className="text-sm hover:text-green-300 transition duration-200">
                                Créer un profil
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <Link to="/assigned-courses" className="text-sm hover:text-green-300 transition duration-200">
                                Verifier collègues
                            </Link>
                        </div>
                    </>
                )}

                {!isLoggedIn && (
                    <>
                        <div className="flex items-center">
                            <Link to="/accountcreation" className="text-sm hover:text-green-300 transition duration-200">
                                Creer un utilisateur
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <Link to="/login" className="text-sm hover:text-green-300 transition duration-200">
                                LOGIN
                            </Link>
                        </div>
                    </>
                )}
            </div>

            {isLoggedIn && (
                <div className="flex items-center">
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