import {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import CollapsibleButton from './CollapsibleButton';
import SearchAndChose from "./SearchAndChose";
import UEModel from "../../scripts/Models/UEModel.ts";
import { Course } from "../../scripts/API/APITypes/Course.ts";
import AlreadyAffectedList from "./AlreadyAffectedList.tsx";
import { UeInUpdate } from "../../scripts/API/APITypes/UE.ts";
import CourseModel from "../../scripts/Models/CourseModel.ts";

const CourseInformation = forwardRef((_props, ref) => {
    const [ueName, setUeName] = useState<string>('');
    const [academicYear, setAcademicYear] = useState<number>(0);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false); // gère l'état du mode édition
    const [idUE, setIDUE] = useState<number>(-1); // Si idUE est -1, ça veut dire qu'aucune UE n'est choisie
    const [idUELoad, setIdUELoad] = useState<boolean>(false);

    const [refreshKey, setRefreshKey] = useState(0); // Clé pour forcer le refresh

    const handleRefresh = () => {
        setRefreshKey((prevKey) => prevKey + 1); // Change la clé pour rerender
    };

    useImperativeHandle(ref, () => ({
        displayUE_By_ID(id: number) {
            setIDUE(id);
            const fetchUEData = async () => {
                try {
                    const response = UEModel.getUEById(id);
                    response.then((ue) => {
                        if (ue instanceof UEModel) {
                            setUeName(ue.name);
                            setCourses(ue.courses);
                            setAcademicYear(ue.academic_year);
                            setIdUELoad(true);
                        }
                    });
                } catch (error) {
                    console.error('Erreur lors de la récupération des données de l\'UE:', error);
                }
            };
            fetchUEData();
        }
    }), );

    useEffect(() => {
            try {
                const response = UEModel.getUEById(idUE);
                response.then((ue) => {
                    if (ue instanceof UEModel) {
                        setUeName(ue.name);
                        setCourses(ue.courses);
                        setAcademicYear(ue.academic_year);
                        setIdUELoad(true);
                    }
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données de l\'UE:', error);
            }
    }, [idUE, refreshKey]);

    const handleCourseChange = (index: number, field: "group_count" | "duration", newValue: string) => {
        const updatedCourses = [...courses];

        // Si la valeur est vide (c'est-à-dire que l'utilisateur a supprimé tous les caractères),
        // on la remplace par "0"
        if (newValue === "") {
            newValue = "0";
        }

        // Si l'utilisateur tape un chiffre, on remplace "0" par ce chiffre
        let parsedValue: number;

        // Si la nouvelle valeur est '0', alors la valeur devient 0.
        if (newValue === "0") {
            parsedValue = 0;
        } else {
            parsedValue = parseInt(newValue, 10);
        }

        if (!isNaN(parsedValue) && parsedValue >= 0) {
            updatedCourses[index] = { ...updatedCourses[index], [field]: parsedValue };
            setCourses(updatedCourses);
        }
    };

    // Handler pour le bouton de validation
    const handleValidate = () => {
        console.log('Validation des données...');
        const modifiesUE: UeInUpdate = {
            name: ueName,
        };

        UEModel.modifyUEById(idUE, modifiesUE);

        courses.forEach((course) => {
            CourseModel.modifyCourseById(course.id, course);
        });

        handleRefresh()
    };

    // Handler pour activer/désactiver le mode édition
    const toggleEditMode = () => {
        setIsEditing(!isEditing); // bascule entre les modes
    };


    // Filtrer les cours pour ne pas afficher ceux où duration ou group_count sont égaux à 0
    const filteredCourses = courses.filter((course) => course.duration > 0 && course.group_count > 0);

    return (
        <div className="p-5">
            {/* Si l'idUE est -1, afficher le message "Veuillez choisir une UE" */}
            {idUE === -1 && (
                <div className="text-center text-red-500 font-semibold">
                    Veuillez choisir une UE
                </div>
            )}

            {/* Bouton pour activer/désactiver le mode édition */}
            {idUE !== -1 && (
                <div className="mb-4">
                    <button
                        onClick={toggleEditMode}
                        className="px-4 py-2 bg-orange-500 text-white rounded"
                    >
                        {isEditing ? "Annuler l'édition" : "Éditer"}
                    </button>
                </div>
            )}

            <span className="w-full text-center inline-block">
                {idUE !== -1 && (
                    <>
                        {isEditing ? (
                            <input
                                type="text"
                                value={ueName}
                                onChange={(e) => setUeName(e.target.value)}
                                autoFocus
                                className="text-center border-b-2 border-blue-500"
                            />
                        ) : (
                            <h1>{idUELoad ? `${ueName} ( ${idUE} : ${academicYear} )` : null}</h1>
                        )}
                    </>
                )}
            </span>

            {idUE !== -1 && (
                <>
                    <div>
                        {filteredCourses.length === 0 ? (
                            <div className="text-center text-red-500 font-semibold">
                                Aucuns cours valides à afficher (duration ou group_count égaux à 0)
                            </div>
                        ) : (
                            courses.map((course, index) => (
                                <div key={index} className="form-field">
                                    <p>
                                        {course.course_type.name} :
                                        {/* En mode édition, on permet de modifier la durée et le nombre de groupes */}
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="number"
                                                    value={course.duration === 0 ? '' : course.duration}
                                                    onChange={(e) => handleCourseChange(index, "duration", e.target.value)}
                                                    className="ml-2 w-16 border rounded text-center"
                                                />
                                                *
                                                <input
                                                    type="number"
                                                    value={course.group_count === 0 ? '' : course.group_count}
                                                    onChange={(e) => handleCourseChange(index, "group_count", e.target.value)}
                                                    className="ml-2 w-16 border rounded text-center"
                                                />
                                            </>
                                        ) : (
                                            // En mode non-édition, on affiche simplement les informations
                                            <span>{course.duration} * {course.group_count}</span>
                                        )}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    <div>
                        {filteredCourses.map((course, index) => (
                            <div key={index} className="form-field pt-5">
                                <div>
                                    <p>ID cours : {course.id}</p>
                                    <b>{course.course_type.name} </b>
                                    <p>description : {course.course_type.description}</p>


                                </div>

                                <CollapsibleButton>
                                    <SearchAndChose id_cours={course.id} groupCount={course.group_count} />
                                </CollapsibleButton>

                                {Array.from({ length: course.group_count }, (_, i) =>
                                    <>

                                        <AlreadyAffectedList
                                            group={i}
                                            refreshNumber={refreshKey}
                                            duree = {course.duration}
                                            course_id={course.id} refresh={handleRefresh}/>
                                    </>
                                )}


                            </div>
                        ))}
                    </div>

                    {/* Ajouter un bouton de validation */}
                    {isEditing && (
                        <div className="mt-4">
                            <button
                                onClick={handleValidate}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Valider
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
});

export default CourseInformation;
