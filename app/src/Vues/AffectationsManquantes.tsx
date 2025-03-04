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
    const [isModalOpen, setIsModalOpen] = useState(false); // État du modal

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
    },  [isModalOpen]);

    // Met à jour l'affichage du cours lorsque ueId change
    useEffect(() => {
        if (ueId !== null && courseInfoRef.current) {
            courseInfoRef.current.displayUE_By_ID(ueId);
        }
    }, [ueId]);

    // Fonction pour ouvrir le modal
    const openUEModal = (newUeId: number) => {
        setUeId(newUeId);
        setIsModalOpen(true);
        modalRef.current?.showModal();
    };

    // Fonction pour fermer le modal et rafraîchir le composant
    const closeUEModal = () => {
        setIsModalOpen(false);
        setUeId(null); // Réinitialise ueId
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Affectations Manquantes</h2>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Professeurs</h3>
                {listeAffectationsManquantesProf.length > 0 ? (
                    <ul className="list-disc ml-5">
                        {listeAffectationsManquantesProf.map((prof) => (
                            <li key={prof.id}>
                                {prof.firstname} - {prof.lastname} : {prof.hours_affected} / {prof.quota}
                                <Link to={`/affectation/${prof.id}`} title="Voir affectations">
                                    <FontAwesomeIcon icon={faCalendarDays} className="text-green-500 hover:text-green-700 cursor-pointer text-xl pl-2 pr-2" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucune affectation manquante pour les professeurs.</p>
                )}
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Unités d'Enseignement (UE)</h3>

                {/* Modal */}
                <dialog ref={modalRef} id="modal_ue" className="modal" onClose={closeUEModal}>
                    <div className="modal-box">
                        <CourseInformation ref={courseInfoRef} />

                        <form method="dialog">
                            <button className="btn" onClick={closeUEModal}>Fermer</button>
                        </form>
                    </div>
                </dialog>

                {listeAffectationsManquantesUE.length > 0 ? (
                    <ul className="list-disc ml-5">
                        {listeAffectationsManquantesUE.map((ue) => (
                            <li key={ue.ue_id}>
                                {ue.name} : {ue.affected_hours} / {ue.total_hours}

                                {/* Bouton pour ouvrir le modal */}
                                <button
                                    className="btn ml-2 bg-green-500"
                                    onClick={() => openUEModal(ue.ue_id)}
                                >
                                    Ouvrir menu de l'UE
                                </button>

                                <ul>
                                    {ue.courses.map((course) => (
                                        <li key={course.id} className="pl-2">
                                            {course.course_type.name} : {course.affected_hours} / {course.duration}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucune affectation manquante pour les unités d'enseignement.</p>
                )}
            </div>
        </div>
    );
};

export default AffectationsManquantes;
