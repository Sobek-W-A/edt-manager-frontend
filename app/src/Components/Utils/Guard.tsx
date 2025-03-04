import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import AuthModel from '../../scripts/Models/AuthModel';

/**
 * Guard component to restrict access based on authentication and roles.
 *
 * @param children The content to render if access is granted.
 * @param allowedRoles Array of roles allowed to access the route.
 */
const Guard = ({ children, allowedRoles }: { children: ReactNode; allowedRoles: string[] }) => {
    const location = useLocation();

    // Redirect to login if not authenticated
    if (!AuthModel.isLoggedIn()) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    const userRole = AuthModel.getRole();

    // Redirect to unauthorized page if role is not allowed
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    }

    // Render children if all checks pass
    return <>{children}</>;
};

export default Guard;