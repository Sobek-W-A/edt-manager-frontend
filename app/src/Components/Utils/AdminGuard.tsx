import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthModel from '../../scripts/Models/AuthModel';
import RoleAPI from '../../scripts/API/ModelAPIs/RoleAPI';
import APIResponse from '../../scripts/API/Responses/APIResponse';
import { RoleType } from '../../scripts/API/APITypes/Role';
import AffectationAPI from '../../scripts/API/ModelAPIs/AffectationAPI'; // Import AffectationAPI


const ACADEMIC_YEAR = "2024";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            console.log('[AdminGuard] Starting admin permission check...');
            
            if (!AuthModel.isLoggedIn()) {
                console.warn('[AdminGuard] User not authenticated');
                setLoading(false);
                return;
            }

            try {
                console.log('[AdminGuard] Fetching user profile...');
                const profileResponse = await AffectationAPI.getProfile();
                
                if (profileResponse.isError()) {
                    console.error('[AdminGuard] Profile fetch error:', profileResponse.errorMessage());
                    throw new Error(profileResponse.errorMessage());
                }

                // Temporary type assertion until API types are updated
                const profile = profileResponse.responseObject() as unknown as { 
                    account_id: number;
                    firstname: string;
                    lastname: string;
                    mail: string;
                };
                
                console.log('[AdminGuard] Profile data:', profile);
                console.log('[AdminGuard] Extracted account ID:', profile.account_id);

                console.log('[AdminGuard] Fetching roles for account ID:', profile.account_id);
                const rolesResponse: APIResponse<RoleType> = await RoleAPI.getUserRoles(
                    profile.account_id,
                    ACADEMIC_YEAR
                );

                if (rolesResponse.isError()) {
                    console.error('[AdminGuard] Roles fetch error:', rolesResponse.errorMessage());
                    throw new Error(rolesResponse.errorMessage());
                }

                const roleData = rolesResponse.responseObject();
                console.log('[AdminGuard] Received role data:', roleData);

                const hasAdminRole = roleData.name === 'Administrateur';
                console.log(`[AdminGuard] Admin check result: ${hasAdminRole}`);
                setIsAdmin(hasAdminRole);

            } catch (error) {
                console.error('[AdminGuard] Error during admin check:', error);
                setIsAdmin(false);
            } finally {
                console.log('[AdminGuard] Loading complete');
                setLoading(false);
            }
        };

        checkAdminStatus();
    }, []);

    if (loading) {
        console.log('[AdminGuard] Rendering loading state');
        return <div>Loading permissions...</div>;
    }

    if (!AuthModel.isLoggedIn()) {
        console.log('[AdminGuard] Redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        console.warn('[AdminGuard] Access denied - user is not administrator');
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    console.log('[AdminGuard] Access granted - user is administrator');
    return <>{children}</>;
};

export default AdminGuard;