import NavBar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import {Outlet} from "react-router-dom";

function Layout() {
        return (
            <div className='min-h-screen flex flex-col h-[100vh]'>
                <NavBar/>
                <div className="flex-grow h-[86%]">
                    <Outlet/>
                </div>
                <Footer/>
            </div>
        );
}

export default Layout;