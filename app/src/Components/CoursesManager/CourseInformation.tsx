
import React, {useState, useEffect, useImperativeHandle, forwardRef} from 'react';
import CollapsibleButton from './CollapsibleButton';
import SearchAndChose from "./SearchAndChose";
import UEModel from "../../scripts/Models/UEModel.ts";
import {Course} from "../../scripts/API/APITypes/Course.ts";

const CourseInformation = forwardRef ( (_props, ref) => {
    const [ueName, setUeName] = useState<string>('');
    const [academicYear, setacademicYear] = useState<number>(0);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [idUE, setIDUE] = useState<string>('');
    const [idUELoad, setidUELoad] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        displayUE_By_ID(id: string) {
            setIDUE(id)
            const fetchUEData = async () => {
                try {
                    const response = UEModel.getUEById(id);
                    response.then((ue) => {
                        if (ue instanceof UEModel) {
                            setUeName(ue.name);
                            setCourses(ue.courses)
                            setacademicYear(ue.academic_year)
                            setidUELoad(true)
                        }
                    })
                } catch (error) {
                    console.error('Erreur lors de la récupération des données de l\'UE:', error);
                }
            };

            fetchUEData();
        }
    }));

    useEffect(() => {

    });

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUeName(e.target.value);
    };

    const handleBlur = async () => {
        setIsEditing(false);
    };

    return (
        <div className="p-5">
            <span className="w-full text-center inline-block">

                {isEditing ? (
                    <input
                        type="text"
                        value={ueName}
                        onChange={handleChange}
                        onBlur={handleBlur} // Sauvegarde la modification
                        autoFocus
                        className="text-center border-b-2 border-blue-500"
                    />
                ) : (
                    <h1 onDoubleClick={handleDoubleClick} className="cursor-pointer">
                        {idUELoad ? (ueName + " ( " + idUE + " : " + academicYear + " )") : null}
                    </h1>
                )}
            </span>

            <div>
                {courses.map((course, index) => (

                    <div key={index} className="form-field pt-5">
                        <div>
                            <p>ID cours : {course.id}</p>
                            <b>{course.course_type.name} </b>
                            <p>description : {course.course_type.description}</p>
                        </div>

                        <CollapsibleButton>
                            <SearchAndChose
                            id_cours={course.id}
                            groupCount={course.group_count}/>
                        </CollapsibleButton>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default CourseInformation;