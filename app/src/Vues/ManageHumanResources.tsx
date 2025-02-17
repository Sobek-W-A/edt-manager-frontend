import React, { Component, createRef } from 'react';
import SplitPane from 'react-split-pane';
import Tree from "../Components/CoursesManager/Tree.tsx";
import CourseInformation from "../Components/CoursesManager/CourseInformation.tsx";

class ManageHumanResources extends Component {
    courseInfoRef = createRef<CourseInformation>();

    render() {
        return (
            // Utilisation de 100vh pour occuper toute la hauteur de la page
            <div style={{ minHeight: '80vh', overflow: 'hidden' }} className="flex flex-col">
                <SplitPane
                    split="vertical"
                    minSize={200}
                    defaultSize={500}
                    pane1Style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                        borderRight: 'none'
                    }}
                    pane2Style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                        height: '100%',
                        borderLeft: 'none'
                    }}
                    resizerStyle={{ cursor: 'col-resize', background: '#ccc', width: '5px' }}
                    // On passe ici une hauteur de 100% pour que le SplitPane prenne tout l'espace disponible
                    style={{ height: '100%', position: 'relative' }}
                >
                    <div>
                        <Tree onSelectCourse={(course) => this.courseInfoRef.current?.displayUE_By_ID(course.id)} />
                    </div>
                    <div>
                        <CourseInformation ref={this.courseInfoRef} />
                    </div>
                </SplitPane>
            </div>
        );
    }
}

export default ManageHumanResources;
