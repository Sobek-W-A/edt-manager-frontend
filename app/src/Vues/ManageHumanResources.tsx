import React, { Component, createRef } from 'react';
import SplitPane from 'react-split-pane';
import Tree from "../Components/CoursesManager/Tree.tsx";
import CourseInformation from "../Components/CoursesManager/CourseInformation.tsx";

class ManageHumanResources extends Component {
    courseInfoRef = createRef<CourseInformation>();

    render() {
        return (
            <div className="flex-grow flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>
                <SplitPane
                    split="vertical"
                    minSize={200}
                    defaultSize={500}
                    pane1Style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '100%', borderRight: 'none' }}
                    pane2Style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '100%', borderLeft: 'none' }}
                    resizerStyle={{ cursor: 'col-resize', background: '#ccc', width: '5px' }}
                    style={{ height: 'auto', position: 'relative' }}
                >
                    <div>
                        {/* Passez la fonction displayUE_By_ID de CourseInformation comme prop */}
                        <Tree onSelectCourse={(course) => this.courseInfoRef.current?.displayUE_By_ID(course.id)} />
                    </div>
                    <div className="col-start-4 col-span-7">
                        <CourseInformation ref={this.courseInfoRef} />
                    </div>
                </SplitPane>
            </div>
        );
    }
}

export default ManageHumanResources;
