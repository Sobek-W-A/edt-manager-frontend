import React from 'react';
import { Link, Outlet } from 'react-router-dom';

class Layout extends React.Component {
    render() {
        return (
            <div>
                {/* Futur bandeau */}
                <nav>
                </nav>

                {/* Outlet pour rendre les sous-routes */}
                <div>
                    <Outlet />
                </div>
            </div>
        );
    }
}

export default Layout;