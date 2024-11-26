import {Component} from 'react';
import SplitPane from 'react-split-pane';
import Tree from "../Components/CoursesManager/Tree.tsx";
import CourseInformation from "../Components/CoursesManager/CourseInformation.tsx";

class ManageHumanResources extends Component {
    
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
                    style={{ height: '88.5%' }}
                >
                    <div>
                        <Tree />
                    </div>
                    <div>
                        <CourseInformation />
                    </div>
                </SplitPane>
            </div>
        );
    }
}

export default ManageHumanResources;
