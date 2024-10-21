import {Link} from "react-router-dom";
import '../../index.css';
function Navbar () {

    //grid grid-cols-10
    return <div className="w-full bg-red-text mb-12 border-b-2 border-t-2 p-2 pb-3 text-2xl font-bold grid grid-cols-10">
        <div className="col-start-1 col-end-1">
            <Link className="" to='/' ><span className="align-middle ml-1  ">SOBEK W.A.</span></Link>
        </div>

            <div className="col-start-2 col-end-11  grid grid-cols-11">
                <div className="col-start-1">
                    <Link to='/example' className="text-sm">EXAMPLE</Link>
                </div>
            </div>

    </div>
}

export default Navbar;