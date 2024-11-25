import React from 'react';
import CollapsibleButton from './CollapsibleButton';
import SearchAndChose from "./SearchAndChose.tsx";

const CourseInformation: React.FC = () => {
    return (
        <div className="w-full">
            TODO Matthieu
            <br />
            Lorem Ipsum
            <div className="form-field pt-5">
                <CollapsibleButton>
                    <SearchAndChose/>
                </CollapsibleButton>
            </div>
        </div>
    );
};

export default CourseInformation;