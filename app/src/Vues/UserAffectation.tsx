import React, { useState, useEffect, useRef } from "react";
import { Profile } from "../scripts/API/APITypes/Profiles.ts";
import ProfileAPI from "../scripts/API/ModelAPIs/ProfileAPI.ts";
import Notification from "../Components/AddRole/AddRolePopUp";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faClock, faIdBadge, faBook, faInfoCircle, faTasks, faCalendar, faUsers, faStickyNote, faArrowUpRightFromSquare, faTimes } from "@fortawesome/free-solid-svg-icons";
import AffectationAPI from "../scripts/API/ModelAPIs/AffectationAPI.ts";
import { Affectation } from "../scripts/API/APITypes/AffectationType.ts";
import CourseInformation from "../Components/CoursesManager/CourseInformation.tsx";
import Tree from "../Components/CoursesManager/Tree.tsx"
import { UE } from "../scripts/API/APITypes/UE.ts";
import UEAPI from "../scripts/API/ModelAPIs/UEAPI.ts";
import StatusAPI from "../scripts/API/ModelAPIs/StatusAPI.ts";
import { StatusType } from "../scripts/API/APITypes/Status.ts";

function UserAffectation() {
    const { idProfile } = useParams<{ idProfile: string }>();
    const [profile, setProfile] = useState<Profile>();
    const [affectations, setAffectations] = useState<Affectation[]>([]);
    const [ue, setUe] = useState<UE[]>();
    const [status, setStatus] = useState<StatusType>({} as StatusType);

    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showNotification, setShowNotification] = useState(false);

    const [ACADEMIC_YEAR, setACADEMIC_YEAR] = useState<string>(window.sessionStorage.getItem("academic_year") || new Date().getFullYear().toString());
    const COURSE_TYPE = ["CM", "TD", "TP", "EI", "TPL"];

    const courseInfoRef = useRef(null);
    const ueId = 1;

    // Utilisation de useEffect pour récupérer l'année académique lorsqu'elle change dans le session storage
    useEffect(() => {
        const handleSessionStorageChange = () => {
            const academicYear = window.sessionStorage.getItem("academic_year");
            if (academicYear) {
                setACADEMIC_YEAR(academicYear);
            }
        };

        const originalSetItem = sessionStorage.setItem;
        sessionStorage.setItem = function (key, value) {
            originalSetItem.apply(this, arguments);
            handleSessionStorageChange();
        };

        return () => {
            sessionStorage.setItem = originalSetItem;
        };
    }, []);

    useEffect(() => {
        const fetchProfileData = async () => {
            const profileResponse = await ProfileAPI.getProfileById(Number(idProfile));
            if (profileResponse.isError()) {
                setNotification({ message: `Erreur dans la récuperation des comptes : ${profileResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                setProfile(profileResponse.responseObject());
            }

            const affectationResponse = await AffectationAPI.getTeacherAffectationsByProfileId(Number(idProfile));
            if (affectationResponse.isError()) {
                setNotification({ message: `Erreur dans la récuperation des affectations : ${affectationResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                setAffectations(affectationResponse.responseObject());
            }

            const ueResponse = await UEAPI.getUEsByProfileId(Number(idProfile));
            if (ueResponse.isError()) {
                setNotification({ message: `Erreur dans la récuperation des UE : ${ueResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                setUe(ueResponse.responseObject());
            }
        };
        fetchProfileData();
    }, [ACADEMIC_YEAR]);

    useEffect(() => {
        const fetchStatusData = async () => {
            const statusResponse = await StatusAPI.getStatusById(profile?.status_id as number);
            if (statusResponse.isError()) {
                setNotification({ message: `Erreur dans la récuperation de status : ${statusResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                setStatus(statusResponse.responseObject());
            }
        };

        if (profile) fetchStatusData().then();
    }, [profile]);


    useEffect(() => {
        setAffectations(affectations => 
            affectations.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );
    }, []); 

    useEffect(() => {
        if (courseInfoRef.current) {
            courseInfoRef.current.displayUE_By_ID(ueId);
        }
    }, [ueId]);

    const openModal = () => {
        const modal = document.getElementById("modal_affectation") as HTMLDialogElement;
        modal?.showModal();
    };

    const closeModal = () => {
        const modal = document.getElementById("modal_affectation") as HTMLDialogElement;
        modal?.close();
    };


    return (
        <div className="flex justify-center mt-6">
            <div className="w-fit p-6 rounded-lg shadow-md">
                <div className="max-w-7xl mx-auto text-center mb-6">
                    <h2 className="text-2xl font-bold text-center text-green-800">Affectations</h2>
                    {profile && (
                        <div>
                            <h3 className="text-xl font-semibold">{profile.lastname} {profile.firstname}</h3>
                            <p className="text-gray-500"><FontAwesomeIcon icon={faEnvelope} /> {profile.mail}</p>
                            <p className={`text-gray-500 ${affectations.reduce((sum, affectation) => sum + affectation.hours, 0) > status?.quota ? 'text-red-500' : 'text-green-500'}`}>
                                Quota : {affectations.reduce((sum, affectation) => sum + affectation.hours, 0)}/{status?.quota} h
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
                                {ue && ue.length > 0 ? (
                                    ue.map((ueItem, index) => (
                                        <ul className="menu menu-xs rounded-box max-w-xs w-full border p-4 rounded shadow-md">
                                            <li key={`ue_${ueItem.id}`}>
                                                <details open>
                                                    <summary className="text-xl"><FontAwesomeIcon icon={faBook} /> {ueItem.name}</summary>
                                                    <ul>
                                                        {ueItem.courses && ueItem.courses.length > 0 ? (
                                                            ueItem.courses.map(course =>
                                                                <>
                                                                    {affectations.length > 0 ? (
                                                                        Object.values(
                                                                            affectations.reduce<Record<string, Affectation[]>>((acc, affectation) => {
                                                                                const courseTypeName = affectation.course.course_type.name;
                                                                                if (!acc[courseTypeName]) {
                                                                                    acc[courseTypeName] = [];
                                                                                }
                                                                                acc[courseTypeName].push(affectation);
                                                                                return acc;
                                                                            }, {})
                                                                        )
                                                                            .map((affectationsByType: Affectation[], index: number) => {
                                                                                // On filtre les affectations par l'ID du cours
                                                                                const filteredAffectations = affectationsByType.filter((aff) => aff.course.id === course.id);

                                                                                // Ne pas afficher si la liste filtrée est vide
                                                                                if (filteredAffectations.length === 0) return null;

                                                                                return (
                                                                                    <>
                                                                                        <li key={`course_infos_${index}`}>
                                                                                            <p className="flex items-center text-lg" onClick={openModal}><FontAwesomeIcon icon={faArrowUpRightFromSquare} />Voir les infos du cours</p>
                                                                                        </li>
                                                                                        <li key={`course_${index}`}>
                                                                                            <details key={`affectation_${index}`}>
                                                                                                <summary className="text-lg">
                                                                                                    <FontAwesomeIcon icon={faBook} />
                                                                                                    {COURSE_TYPE[filteredAffectations[0].course.course_type.id - 1]}
                                                                                                    {filteredAffectations[0].group}&nbsp;&nbsp;&nbsp;
                                                                                                    {filteredAffectations.reduce((sum, affectation) => sum + affectation.hours, 0)}/{filteredAffectations[0].course.duration}h
                                                                                                </summary>
                                                                                                <ul>
                                                                                                    <li key={`affectation_${index}`}>
                                                                                                        <p className="flex items-center"><FontAwesomeIcon icon={faTasks} />Total des heures à effectuer : {filteredAffectations.reduce((sum, affectation) => sum + affectation.hours, 0)} h</p>
                                                                                                        {filteredAffectations.map(affectation => (
                                                                                                            <details key={affectation.id}>
                                                                                                                <summary>
                                                                                                                    <FontAwesomeIcon icon={faCalendar} /> Modification du {new Date(affectation.date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                                                                </summary>
                                                                                                                <ul>
                                                                                                                    <li key={affectation.id}>
                                                                                                                        <p><FontAwesomeIcon icon={faInfoCircle} /> description : {affectation.course.course_type.description}</p>
                                                                                                                        <p><FontAwesomeIcon icon={faTasks} /> affectées/total à affecter : {affectation.hours}/{affectation.course.duration} h</p>
                                                                                                                        <p><FontAwesomeIcon icon={faUsers} /> Groupe : {affectation.group}</p>
                                                                                                                        <p><FontAwesomeIcon icon={faStickyNote} /> Note : {affectation.notes}</p>
                                                                                                                    </li>
                                                                                                                </ul>
                                                                                                            </details>
                                                                                                        ))}
                                                                                                    </li>
                                                                                                </ul>
                                                                                            </details>
                                                                                        </li>
                                                                                    </>
                                                                                );
                                                                            })
                                                                    ) : (
                                                                        <p className="text-gray-500 text-center col-span-full">Aucune affectation</p>
                                                                    )}
                                                                </>

                                                            )
                                                        ) : (
                                                            <p className="text-gray-500">Aucun cours</p>
                                                        )}
                                                    </ul>
                                                </details>
                                            </li>
                                        </ul>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center col-span-full">Aucune UE</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notification */}
                    {showNotification && <Notification message={notification.message} type={notification.type} />}
                </div>
            </div>

            {/* Modale */}
            <dialog id="modal_affectation" className="modal">
                <div className="modal-box w-[80vw] max-w-5xl relative">
                    <button 
                        className="absolute top-2 right-2 text-red-500 hover:scale-125  transition-transform duration-200"
                        onClick={closeModal}
                        title="Fermer la fenêtre"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                    </button>

                    <h3 className="font-bold text-lg">Page d'affichage des cours</h3>
                    <ul className="space-y-2">
                        <CourseInformation ref={courseInfoRef} />
                    </ul>
                    <div className="modal-action">
                        <button className="btn bg-gray-300" onClick={closeModal}>Fermer</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default UserAffectation;

