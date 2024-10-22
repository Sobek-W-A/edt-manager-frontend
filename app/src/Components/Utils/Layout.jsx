import React from 'react';
import NavBar from "./Navbar.jsx";
import Centre from "./Centre.jsx";
import Footer from "./Footer.jsx";

function Layout() {
        return (
            <div className='bg-gunmetal min-h-screen flex flex-col'>
                <NavBar/>
                <div className="flex-grow">
                    <Centre/>
                </div>
                <Footer/>
            </div>
        );
}

export default Layout;