import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AuthModel from '../../scripts/Models/AuthModel';
import { useEffect, useState } from 'react';
import Storage from '../../scripts/API/Storage.ts';
import AcademicYearAPI from "../../scripts/API/ModelAPIs/AcademicYearAPI.ts";
import { AcademicYearType } from "../../scripts/API/APITypes/AcademicYearType.ts";
import { useNavigate } from 'react-router-dom';

// Définir les pages autorisées par rôle
const rolePermissions: { [key: string]: string[] } = {
    'Administrateur': [
        '/add-role',
        '/management',
        '/profileCreation',
        '/accountcreation',
        '/assigned-courses',
    ],
    'Professeur': ['/assigned-courses'],
    'Responsable de département': ['/management', '/assigned-courses'],
    'Responsable de formation': ['/management', '/assigned-courses'],
    'Secrétariat': ['/management', '/assigned-courses'],
};

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string>(''); // Stocker le rôle de l'utilisateur
    const navigate = useNavigate();

    // Vérifier si l'utilisateur est connecté et récupérer son rôle
    useEffect(() => {
        setIsLoggedIn(AuthModel.isLoggedIn());
        if (AuthModel.isLoggedIn()) {
            setUserRole(AuthModel.getRole()); // Récupérer le rôle
        }
    }, []);

    const [academicYear, setAcademicYear] = useState<number>();
    const [academicYears, setAcademicYears] = useState<AcademicYearType[]>([]);
    const [loading, setIsLoading] = useState<boolean>(false);
    const [refreshAcademicYear, setRefreshAcademicYear] = useState<boolean>(false);

    // Gestion des années académiques
    useEffect(() => {
        setIsLoading(true);
        const fetchAcademicYear = async () => {
            const response = await AcademicYearAPI.getAllAcademicYear();
            const academicYearsData = response.responseObject();
            setAcademicYears(academicYearsData);
            setIsLoading(false);

            const storedAcademicYear = Storage.getAcademicYear();
            if (storedAcademicYear) {
                setAcademicYear(storedAcademicYear);
            } else {
                const lastAcademicYear = academicYearsData[academicYearsData.length - 1].academic_year;
                setAcademicYear(lastAcademicYear);
                Storage.setAcademicYear(lastAcademicYear);
            }
        };

        if (isLoggedIn) fetchAcademicYear();
    }, [isLoggedIn, refreshAcademicYear]);

    const academicYearDescription = (year: number | undefined): string | undefined => {
        return academicYears.find(academicYear => academicYear.academic_year == year)?.description;
    };

    const handleChangeAcadmicYear = (year: number) => {
        setAcademicYear(year);
        Storage.setAcademicYear(year);
    };

    const createNextAcademicYear = async () => {
        const response = await AcademicYearAPI.createNextAcademicYear();
        if (response.isError()) {
            console.log(response);
        } else {
            setRefreshAcademicYear(prevState => !prevState);
        }
    };

    // Vérifier si un lien est autorisé pour le rôle de l'utilisateur
    const isLinkAllowed = (path: string) => {
        const allowedLinks = userRole ? rolePermissions[userRole] || [] : [];
        return allowedLinks.includes(path);
    };

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
                        {isLinkAllowed('/add-role') && (
                            <div className="flex items-center">
                                <Link to="/add-role" className="text-sm hover:text-green-300 transition duration-200">
                                    Liste d'utilisateurs
                                </Link>
                            </div>
                        )}
                        {isLinkAllowed('/management') && (
                            <div className="flex items-center">
                                <Link to="/management" className="text-sm hover:text-green-300 transition duration-200">
                                    Gestion des cours
                                </Link>
                            </div>
                        )}
                        {isLinkAllowed('/profileCreation') && (
                            <div className="flex items-center">
                                <Link to="/profileCreation" className="text-sm hover:text-green-300 transition duration-200">
                                    Créer un profil
                                </Link>
                            </div>
                        )}
                        {isLinkAllowed('/accountcreation') && (
                            <div className="flex items-center">
                                <Link to="/accountcreation" className="text-sm hover:text-green-300 transition duration-200">
                                    Créer un utilisateur
                                </Link>
                            </div>
                        )}
                        {isLinkAllowed('/assigned-courses') && (
                            <div className="flex items-center">
                                <Link to="/assigned-courses" className="text-sm hover:text-green-300 transition duration-200">
                                    Affectations Requises
                                </Link>
                            </div>
                        )}
                        <div className="flex items-center">
                            <div className="dropdown dropdown-hover">
                                <div tabIndex={0} className="cursor-pointer text-sm bg-green-700 text-white focus:outline-none">
                                    Année {academicYearDescription(academicYear)}
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu bg-green-100 text-gray-700 rounded-box z-[1] w-52 p-2 shadow">
                                    <li onClick={() => navigate('/academic-years')} className="cursor-pointer p-2 hover:bg-green-200 rounded">
                                        Gérer Année
                                    </li>
                                    {academicYears.map(year => (
                                        <li key={year.academic_year} onClick={() => handleChangeAcadmicYear(year.academic_year)}
                                            className="cursor-pointer p-2 hover:bg-green-200 rounded">
                                            {year.description}
                                        </li>
                                    ))}
                                    {loading && <span>Loading ...</span>}
                                </ul>
                            </div>
                        </div>
                    </>
                )}

                {!isLoggedIn && (
                    <div className="flex items-center">
                        <Link to="/login" className="text-sm hover:text-green-300 transition duration-200">
                            LOGIN
                        </Link>
                    </div>
                )}
            </div>

            {isLoggedIn && (
                <div className="flex items-center">
                    <button
                        onClick={() => {
                            AuthModel.logout();
                            setIsLoggedIn(false);
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