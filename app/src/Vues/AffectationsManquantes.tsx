import React, { useEffect, useRef, useState } from "react";
import ProfileAPI from "../scripts/API/ModelAPIs/ProfileAPI.ts";
import UEAPI from "../scripts/API/ModelAPIs/UEAPI.ts";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import CourseInformation from "../Components/CoursesManager/CourseInformation.tsx";

interface AffectationProf {
    id: number;
    firstname: string;
    lastname: string;
    hours_affected: number;
    quota: number;
}

interface Course {
    id: number;
    course_type: {
        name: string;
    };
    affected_hours: number;
    duration: number;
}

interface AffectationUE {
    ue_id: number;
    name: string;
    affected_hours: number;
    total_hours: number;
    courses: Course[];
    responsable: string;
}

const AffectationsManquantes: React.FC = () => {
    const [listeAffectationsManquantesProf, setListeAffectationsManquantesProf] = useState<AffectationProf[]>([]);
    const [listeAffectationsManquantesUE, setListeAffectationsManquantesUE] = useState<AffectationUE[]>([]);
    const [ueId, setUeId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const courseInfoRef = useRef<{ displayUE_By_ID: (id: number) => void } | null>(null);
    const modalRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        const fetchAffectationsProf = async () => {
            try {
                const response = await ProfileAPI.getAllProfilesWronglyAffected();
                const data = await response.responseObject();
                setListeAffectationsManquantesProf(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des affectations des professeurs", error);
            }
        };

        const fetchAffectationsUE = async () => {
            try {
                const response = await UEAPI.getAllUEWronglyAffected();
                const data = await response.responseObject();
                setListeAffectationsManquantesUE(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des affectations des UE", error);
            }
        };

        fetchAffectationsProf();
        fetchAffectationsUE();
    }, [isModalOpen]);

    useEffect(() => {
        if (ueId !== null && courseInfoRef.current) {
            courseInfoRef.current.displayUE_By_ID(ueId);
        }
    }, [ueId]);

    const openUEModal = (newUeId: number) => {
        setUeId(newUeId);
        setIsModalOpen(true);
        modalRef.current?.showModal();
    };

    const closeUEModal = () => {
        setIsModalOpen(false);
        setUeId(null);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Affectations Manquantes</h2>

            {/* Collapse pour Professeurs */}
            <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-6">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-semibold text-gray-700">
                    Professeurs
                </div>
                <div className="collapse-content">
                    {listeAffectationsManquantesProf.length > 0 ? (
                        <ul className="space-y-3 mt-4">
                            {listeAffectationsManquantesProf.map((prof) => (
                                <li
                                    key={prof.id}
                                    className="flex items-center justify-between p-4 bg-white rounded shadow hover:shadow-md transition-shadow"
                                >
                                    <span className="text-gray-700">
                                        {prof.firstname} {prof.lastname} :{" "}
                                        <span className="font-medium">{prof.hours_affected}</span> / {prof.quota}
                                    </span>
                                    <Link to={`/affectation/${prof.id}`} title="Voir affectations">
                                        <FontAwesomeIcon
                                            icon={faCalendarDays}
                                            className="text-green-500 hover:text-green-700 text-2xl transition-colors"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-4">Aucune affectation manquante pour les professeurs.</p>
                    )}
                </div>
            </div>

            {/* Collapse pour Unités d'Enseignement */}
            <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-semibold text-gray-700">
                    Unités d'Enseignement (UE)
                </div>
                <div className="collapse-content">
                    <dialog ref={modalRef} id="modal_ue" className="modal">
                        <div className="modal-box w-[80vw] max-w-5xl p-6">
                            <CourseInformation ref={courseInfoRef} />
                            <div className="mt-4 flex justify-end">
                                <button onClick={closeUEModal} className="btn bg-red-500 hover:bg-red-600 text-white">
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </dialog>
                    {listeAffectationsManquantesUE.length > 0 ? (
                        <ul className="space-y-4 mt-4">
                            {listeAffectationsManquantesUE.map((ue) => (
                                <li key={ue.ue_id} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-gray-800 font-medium">
                                            {ue.name} : {ue.affected_hours} / {ue.total_hours}
                                        </div>
                                        <button
                                            className="btn bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded transition-colors"
                                            onClick={() => openUEModal(ue.ue_id)}
                                        >
                                            Ouvrir menu de l'UE
                                        </button>
                                    </div>
                                    {ue.courses.length > 0 && (
                                        <ul className="ml-6 border-l border-gray-300 pl-4 space-y-1">
                                            {ue.courses.map((course) => (
                                                <li key={course.id} className="text-gray-600">
                                                    {course.course_type.name} :{" "}
                                                    <span className="font-medium">{course.affected_hours}</span> /{" "}
                                                    {course.duration}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-4">Aucune affectation manquante pour les unités d'enseignement.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AffectationsManquantes;
