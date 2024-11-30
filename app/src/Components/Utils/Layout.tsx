import NavBar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import {Outlet} from "react-router-dom";

function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow">
                <Outlet />
            </div>
            <Footer className="mt-auto" />
        </div>
    );
}

export default Layout;