import {Outlet} from "react-router-dom";

function Centre() {
    return (
        <div className=" grid grid-cols-6 grid-column: auto; pt-20; pb-12">
            <div className="shadow-2xl ; col-start-2 col-span-4 border rounded ; bg-black-back">
                <Outlet/>
            </div>
        </div>
        );
}

export default Centre;