import React, { useState, useEffect } from 'react';
import CollapsibleButton from './CollapsibleButton';
import SearchAndChose from "./SearchAndChose";

interface CourseInformationProps {
    id: string; // ID passée en props
}

interface Teacher {
    name: string;
    lastname: string;
}

interface Affectation {
    teacher: Teacher;
    idgroupe: string;
    hours: number;
}

interface Course {
    type: string;
    affectations: Affectation[]; // Nouveau champ
}

interface UEData {
    name: string;
    courses: Course[];
}

const CourseInformation: React.FC<CourseInformationProps> = ({ id }) => {
    const [ueName, setUeName] = useState<string>('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const fetchUEData = async () => {
            try {
                const response = null //TODO appel de l'API pour tout ce qu'il faut
                //setUeName(response.data.name);
                //setCourses(response.data.courses);
            } catch (error) {
                console.error('Erreur lors de la récupération des données de l\'UE:', error);
            }
        };

        fetchUEData();
    }, [id]);

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

    return (
        <div className="p-5">
            <div className="w-full text-center">
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
                        {ueName}
                    </h1>
                )}
            </div>

            <div>
                {courses.map((course, index) => (
                    <div key={index} className="form-field pt-5">
                        <div><p>{course.type}</p></div>
                        {course.affectations.map((affectation, indexBis) => (
                            <div key={indexBis}>
                                <p>
                                    {affectation.teacher.name} {affectation.teacher.lastname} est affecté au groupe {affectation.idgroupe} pour une durée de {affectation.hours} heures
                                </p>
                            </div>
                        ))}
                        <CollapsibleButton>
                            <SearchAndChose />
                        </CollapsibleButton>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseInformation;