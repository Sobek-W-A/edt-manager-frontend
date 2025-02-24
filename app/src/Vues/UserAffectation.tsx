import React, { useState, useEffect} from "react";
import { Profile } from "../scripts/API/APITypes/Profiles.ts";
import ProfileAPI from "../scripts/API/ModelAPIs/ProfileAPI.ts";
import Notification from "../Components/AddRole/AddRolePopUp";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faClock, faIdBadge, faBook, faInfoCircle, faTasks, faCalendar, faUsers, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import AffectationAPI from "../scripts/API/ModelAPIs/AffectationAPI.ts";
import { Affectation } from "../scripts/API/APITypes/AffectationType.ts";
import CourseInformation from "../Components/CoursesManager/CourseInformation.tsx";
import Tree from "../Components/CoursesManager/Tree.tsx"
import { UE } from "../scripts/API/APITypes/UE.ts";
import UEAPI from "../scripts/API/ModelAPIs/UEAPI.ts";

function UserAffectation() {
    const { idProfile } = useParams<{ idProfile: string }>();
    const [profile, setProfile] = useState<Profile>();
    const [affectations, setAffectations] = useState<Affectation[]>([]);
    const [ue, setUe] = useState<UE[]>();

    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showNotification, setShowNotification] = useState(false);

    const [ACADEMIC_YEAR, setACADEMIC_YEAR] = useState<string>(window.sessionStorage.getItem("academic_year") || new Date().getFullYear().toString());

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
        setAffectations(prevAffectations => 
            [...prevAffectations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );
    }, [affectations]);


    return (
        <div className="flex justify-center mt-6">
            <div className="w-fit p-6 rounded-lg shadow-md">
                <div className="max-w-7xl mx-auto text-center mb-6">
                    <h2 className="text-2xl font-bold text-center text-green-800">Affectations</h2>
                    {profile && (
                        <div>
                            <h3 className="text-xl font-semibold">{profile.lastname} {profile.firstname}</h3>
                            <p className="text-gray-500"><FontAwesomeIcon icon={faEnvelope} /> {profile.mail}</p>
                            <p className={`text-gray-500 ${affectations.reduce((sum, affectation) => sum + affectation.hours, 0) > profile.quota ? 'text-red-500' : 'text-green-500'}`}>
                                Quota : {affectations.reduce((sum, affectation) => sum + affectation.hours, 0)}/{profile.quota} h
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                                {ue && ue.length > 0 ? (
                                    ue.map((ueItem, index) => (
                                        <div key={index} className="border p-4 rounded shadow-md relative flex flex-col bg-white hover:shadow-lg hover:scale-105 transition-transform duration-200 text-left">
                                            <h3 className="text-lg font-bold mb-2">
                                                <p className="text-gray-500"><FontAwesomeIcon icon={faBook} /> {ueItem.name}</p>
                                                <p className="text-gray-500"><FontAwesomeIcon icon={faIdBadge} /> ID UE : {ueItem.ue_id}</p>
                                            </h3>
                                            {ueItem.courses && ueItem.courses.length > 0 ? (
                                                ueItem.courses.map(course => (
                                                    <div key={course.id} className="p-2 rounded bg-white">
                                                        <p className="text-gray-500"><FontAwesomeIcon icon={faBook} /> {course.course_type.name}</p>
                                                        <p className="text-gray-500"><FontAwesomeIcon icon={faIdBadge} /> {course.id}</p>
                                                        <p className="text-gray-500"><FontAwesomeIcon icon={faInfoCircle} /> Description : {course.course_type.description}</p>
                                                        <p className="text-gray-500"><FontAwesomeIcon icon={faTasks} /> Durée : {course.duration} h</p>
                                                        <p className="text-gray-500"><FontAwesomeIcon icon={faUsers} /> Nombre de groupes : {course.group_count}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">Aucun cours</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center col-span-full">Aucune UE</p>
                                )}

                                {affectations.length > 0 ? (
                                    Object.values(affectations.reduce<Record<string, Affectation[]>>((acc, affectation) => {
                                        const courseTypeName = affectation.course.course_type.name;
                                        if (!acc[courseTypeName]) {
                                            acc[courseTypeName] = [];
                                        }
                                        acc[courseTypeName].push(affectation);
                                        return acc;
                                    }, {})).map((affectationsByType: Affectation[], index: number) => (
                                        <div key={index} className="border p-4 rounded shadow-md relative flex flex-col bg-white hover:shadow-lg hover:scale-105 transition-transform duration-200 text-left">
                                            <h3 className="text-lg font-bold mb-2">
                                                <p className="text-gray-500"><FontAwesomeIcon icon={faBook} /> {affectationsByType[0].course.course_type.name}</p>
                                                <p className="text-gray-500"><FontAwesomeIcon icon={faIdBadge} /> ID cours : {affectationsByType[0].course.id}</p>
                                                <p className="text-gray-500"><FontAwesomeIcon icon={faUsers} /> Nombre de groupes : {affectationsByType[0].course.group_count}</p>
                                                <p className="text-gray-500"><FontAwesomeIcon icon={faTasks} /> Total des heures à effectuer : {affectationsByType.reduce((sum, affectation) => sum + affectation.hours, 0)} h</p>
                                            </h3>
                                            {affectationsByType.map(affectation => (
                                                <details key={affectation.id} className="p-2 rounded bg-white">
                                                    <summary className={`cursor-pointer ${new Date(affectation.date).getTime() < new Date().getTime() ? 'bg-red-100' : 'bg-green-200'}`}>
                                                        <FontAwesomeIcon icon={faCalendar} /> Affectation du {new Date(affectation.date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </summary>
                                                    <div className="p-2">
                                                        <p>{affectation.course?.name}</p>
                                                        <p className="text-gray-500"><FontAwesomeIcon icon={faInfoCircle} /> description : {affectation.course.course_type.description}</p>
                                                        <p className="text-gray-500"><FontAwesomeIcon icon={faTasks} /> affectées/total à affecter : {affectation.hours}/{affectation.course.duration} h</p>
                                                        <p className="text-gray-500"><FontAwesomeIcon icon={faUsers} /> Groupe : {affectation.group}</p>
                                                        <p className="text-gray-500"><FontAwesomeIcon icon={faStickyNote} /> Note : {affectation.notes}</p>
                                                    </div>
                                                </details>
                                            ))}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center col-span-full">Aucune affectation</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notification */}
                    {showNotification && <Notification message={notification.message} type={notification.type} />}
                </div>
            </div>
        </div>
    );
}

export default UserAffectation;