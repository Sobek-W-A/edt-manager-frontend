function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4 text-center h-[7%]">
            <p>&copy; {new Date().getFullYear()} Notre Application. Tous droits réservés.</p>
        </footer>
    );
}

export default Footer;