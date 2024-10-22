import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4 text-center">
            <p>&copy; {new Date().getFullYear()} Notre Application. Tous droits réservés.</p>
        </footer>
    );
};

export default Footer;