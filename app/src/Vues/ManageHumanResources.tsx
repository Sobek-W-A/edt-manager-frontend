import {Component} from 'react';
import Tree from "../Components/CoursesManager/Tree.tsx";
import CourseInformation from "../Components/CoursesManager/CourseInformation.tsx";

class ManageHumanResources extends Component {
    render() {
        return (
            <div className="w-full h-full">
                <div className="grid grid-cols-10">
                    <div className="col-start-1 col-span-3 border-r-4">
                        <Tree/>
                    </div>
                    <div className="col-start-4 col-span-7 border-r-4">
                        <CourseInformation/>
                    </div>

                </div>

            </div>
        );
    }
}

export default ManageHumanResources;