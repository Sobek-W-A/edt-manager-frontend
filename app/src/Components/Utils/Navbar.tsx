import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AuthModel from '../../scripts/Models/AuthModel';
import {useEffect, useState} from 'react';
import Storage from '../../scripts/API/Storage.ts'

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(AuthModel.isLoggedIn());
    }, []);

    const ACADEMIC_YEAR = [2023, 2024, 2025];
    const [academicYear, setAcademicYear] = useState<number>(ACADEMIC_YEAR[1]);

    useEffect(() => {
        const date = new Date();
        Storage.setAcademicYear(date.getFullYear());
    }, []);

    const handleChangeAcadmicYear = (year: number) => {
        setAcademicYear(year);
        Storage.setAcademicYear(year);
    }

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
                            <Link to="/profileCreation"
                                  className="text-sm hover:text-green-300 transition duration-200">
                                Créer un profile
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <Link to="/assigned-courses"
                                  className="text-sm hover:text-green-300 transition duration-200">
                                Cours attribués
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <Link to="/accountcreation"
                                  className="text-sm hover:text-green-300 transition duration-200">
                                Creer un utilisateur
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <div className="dropdown dropdown-hover">
                                <div tabIndex={0}
                                     className="cursor-pointer text-sm bg-green-700 text-white focus:outline-none">
                                    Année {academicYear}
                                </div>
                                <ul tabIndex={0}
                                    className="dropdown-content menu bg-green-100 text-gray-700 rounded-box z-[1] w-52 p-2 shadow">
                                    {ACADEMIC_YEAR.map(year => (
                                        <li key ={year} onClick={() => handleChangeAcadmicYear(year)}
                                            className="cursor-pointer p-2 hover:bg-green-200 rounded">
                                            {year}
                                        </li>))}
                                </ul>
                            </div>
                        </div>
                    </>
                )}

                {!isLoggedIn && (
                    <>
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