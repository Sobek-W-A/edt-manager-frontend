import { Link } from "react-router-dom";

export default function ForbiddenVue() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Accès Refusé</h1>
                <p className="text-gray-600 mb-4">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                </p>
                <Link 
                    to="/" 
                    className="text-blue-600 hover:text-blue-800 transition duration-200"
                >
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}