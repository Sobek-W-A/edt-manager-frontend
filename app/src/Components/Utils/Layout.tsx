import NavBar from "./Navbar.tsx";
import Centre from "./Centre.tsx";
import Footer from "./Footer.tsx";

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