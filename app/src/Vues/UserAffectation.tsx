import React, { useState, useEffect} from "react";
import { Profile } from "../scripts/API/APITypes/Profiles.ts";
import ProfileAPI from "../scripts/API/ModelAPIs/ProfileAPI.ts";
import Notification from "../Components/AddRole/AddRolePopUp";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faClock, faIdBadge, faBook, faInfoCircle, faTasks } from "@fortawesome/free-solid-svg-icons";
import AffectationAPI from "../scripts/API/ModelAPIs/AffectationAPI.ts";
import { Affectation } from "../scripts/API/APITypes/AffectationType.ts";
import CourseInformation from "../Components/CoursesManager/CourseInformation.tsx";
import Tree from "../Components/CoursesManager/Tree.tsx";

function UserAffectation() {
    const { idProfile } = useParams<{ idProfile: string }>();
    const [profile, setProfile] = useState<Profile>();
    const [affectations, setAffectations] = useState<Affectation[]>([]);

    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showNotification, setShowNotification] = useState(false);

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
        };
        fetchProfileData();
    }, []);

    return (
        <div className="flex justify-center mt-6">
            <div className="w-fit p-6 rounded-lg shadow-md">
                <div className="max-w-7xl mx-auto text-center mb-6">
                    <h2 className="text-2xl font-bold text-center text-green-800">Affectations</h2>
                    {profile && (
                        <div>
                            <h3 className="text-xl font-semibold">{profile.lastname} {profile.firstname}</h3>
                            <p className="text-gray-500"><FontAwesomeIcon icon={faEnvelope} /> {profile.mail}</p>
                            <p className="text-gray-500">Quota : {profile.quota}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                                {affectations.length > 0 ? (
                                    affectations.map(affectation =>
                                        <div key={affectation.id} className="border p-4 rounded shadow-md relative flex flex-col bg-white hover:shadow-lg hover:scale-105 transition-transform duration-200 text-left">
                                            <p>{affectation.course?.name}</p>
                                            <p className="text-gray-500"><FontAwesomeIcon icon={faIdBadge} /> ID cours : {affectation.course.id}</p>
                                            <b className="text-gray-500"><FontAwesomeIcon icon={faBook} /> {affectation.course.course_type.name} </b>
                                            <p className="text-gray-500"><FontAwesomeIcon icon={faInfoCircle} /> description : {affectation.course.course_type.description}</p>
                                            <p className="text-gray-500"><FontAwesomeIcon icon={faTasks} /> assignées/total : x/{affectation.course.duration}</p>
                                            <p className="text-gray-500"><FontAwesomeIcon icon={faClock} /> {affectation.hours}h</p>
                                        </div>
                                    )
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