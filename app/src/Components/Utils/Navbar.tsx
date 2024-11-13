import { Link } from "react-router-dom";
import '../../index.css';

function Navbar() {
    return (
        <div className="w-full bg-green-700 mb-12 border-b-2 border-t-2 p-2 pb-3 text-xl font-bold text-white grid grid-cols-10">
            <div className="col-start-1 col-span-2 flex items-center">
                <Link to="/">
                    <span className="ml-2">SOBEK W.A.</span>
                </Link>
            </div>

            {/* Navbar Links */}
            <div className="col-start-3 col-span-6 flex justify-center space-x-4 items-center">
                <Link to="/example" className="text-sm hover:text-green-300 transition duration-200">
                    EXAMPLE
                </Link>
                {/* Ajouter d'autres liens ici si nécessaire */}
            </div>

            {/* Login Link */}
            <div className="col-start-10 col-span-1 flex justify-end items-center">
                <Link to="/login" className="text-sm hover:text-green-300 transition duration-200">
                    LOGIN
                </Link>
            </div>

            {/* Add Role Link */}
            <div className="col-start-10 col-span-1 flex justify-end items-center">
                <Link to="/add-role" className="text-sm hover:text-green-300 transition duration-200">
                    ADD ROLE
                </Link>
            </div>
        </div>
    );
}

export default Navbar;
