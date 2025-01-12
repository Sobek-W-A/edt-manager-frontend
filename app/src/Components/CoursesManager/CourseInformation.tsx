
import React, {useState, useEffect, useImperativeHandle, forwardRef} from 'react';
import CollapsibleButton from './CollapsibleButton';
import SearchAndChose from "./SearchAndChose";
import UEModel from "../../scripts/Models/UEModel.ts";
import {Course} from "../../scripts/API/APITypes/Course.ts";

//TODO A ENLEVER
const mockBody = {
    success: true,
    data: {
        academic_year: 2024,
        id: "idB503",
        name: "BDD",
        courses: [
            {
                academic_year: 2024,
                duration: 90,
                id: "td185",
                courses_types: {
                    name: "td",
                    description: "td d'optimisation",
                    academic_year: 2024,
                },
            },
            {
                academic_year: 2024,
                duration: 75,
                id: "tp303",
                courses_types: {
                    name: "tp",
                    description: "tp de bdd",
                    academic_year: 2024,
                },
            },
        ],
    },
};

const CourseInformation = forwardRef ( (props, ref) => {
    const [ueName, setUeName] = useState<string>('');
    const [academicYear, setacademicYear] = useState<number>(0);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [idUE, setIDUE] = useState<string>('');


    // Exposez la méthode displayUE_By_ID via la référence
    useImperativeHandle(ref, () => ({
        displayUE_By_ID(id: string) {
            console.log(id + " ON UTILISE CETTE ID");
            setIDUE(id)
            const fetchUEData = async () => {
                try {
                    const ue = mockBody.data

                    /**const response = UEModel.getAccountById(idUE)
                    response.then((ue) => {
                        if (ue instanceof UEModel) {
                            setUeName(ue.name);
                            setCourses(ue.courses)
                        }
                    })**/

                    setUeName(ue.name);
                    setCourses(ue.courses)
                    setacademicYear(ue.academic_year)

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
        //TODO update de l'ue, pour le moment que le nom
    };

    // Utilisez selectedCourseId pour afficher les informations de l'UE
    /**React.useEffect(() => {
        if (props.selectedCourseId) {
            ref.current.displayUE_By_ID(props.selectedCourseId); // Appel de la fonction avec l'ID sélectionné
        }
    }, [props.selectedCourseId]);
    **/

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
                        {ueName + " ( " + idUE + " : " + academicYear + " )"}
                    </h1>
                )}
            </span>

            <div>
                {courses.map((course, index) => (

                    <div key={index} className="form-field pt-5">
                        <div>
                            <b>{course.id}</b>
                            <br></br>
                            <b>{course.courses_types.name}</b>
                            <p>description : {course.courses_types.description}</p>
                        </div>

                        <CollapsibleButton>
                            <SearchAndChose />
                        </CollapsibleButton>
                    </div>
                ))}
            </div>
        </div>
    );
});

/**
 {course.affectations.map((affectation, indexBis) => (
 <div key={indexBis}>
 <p>
 {affectation.teacher.name} {affectation.teacher.lastname} est affecté au groupe {affectation.idgroupe} pour une durée de {affectation.hours} heures
 </p>
 </div>
 ))}**/

export default CourseInformation;