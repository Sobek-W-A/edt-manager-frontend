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
                    minSize={100}
                    defaultSize={100}
                    pane1Style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '100%' }}
                    pane2Style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '100%' }}
                    resizerStyle={{ cursor: 'col-resize', background: '#ccc', width: '5px' }}
                    style={{ height: '88.5%' }}
                >
                    <div className="border-r-4" style={{ height: '100%' }}>
                        <Tree style={{ height: '100%', overflow: 'auto' }} />
                    </div>
                    <div className="border-l-4" style={{ height: '100%' }}>
                        <CourseInformation style={{ height: '100%', overflow: 'auto' }} />
                    </div>
                </SplitPane>
            </div>
        );
    }
}

export default ManageHumanResources;
