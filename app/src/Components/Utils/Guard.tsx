import { Navigate, useLocation } from 'react-router-dom';
import AuthModel from '../../scripts/Models/AuthModel'; // Assurez-vous que ce modèle contient la logique d'authentification

import { ReactNode } from 'react';

/**
 * Guard component that checks if the user is logged in. If not, it redirects to the login page.
 * 
 * @param children The children to render if the user is logged in.
 * @returns The children if the user is logged in, a redirection to the login page otherwise.
 */
const Guard = ({ children }: { children: ReactNode }) => {
    const location = useLocation();

    return AuthModel.isLoggedIn() ? (
        children
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    );
};

export default Guard;