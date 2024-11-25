import NavBar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import {Outlet} from "react-router-dom";

function Layout() {
        return (
            <div className='min-h-screen flex flex-col'>
                <NavBar/>
                <div className="flex-grow">
                    <Outlet/>
                </div>
                <Footer/>
            </div>
        );
}

export default Layout;