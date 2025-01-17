import React, {ChangeEvent, useEffect, useState} from "react";
import {Profile} from "../../scripts/API/APITypes/Profiles.ts";
import AffectationAPI from "../../scripts/API/ModelAPIs/AffectationAPI.ts";
import {AffectationInCreate} from "../../scripts/API/APITypes/AffectationType.ts";
import Loader from "../Utils/Loader.tsx";
import Notification from "../AddRole/AddRolePopUp.tsx";


interface AffectationFormProps {
    profile: Profile,
    idCours?: number,
    groupCount: number
}

function AffectationForm({profile, idCours, groupCount}: AffectationFormProps) {

    const [dataToAssignProfessor, setDataToAssignProfessor] = useState<AffectationInCreate>({
        course_id: idCours,
        profile_id: profile.id,
        hours: 0,
        group: 0,
        notes: "",
    });

    const [errors, setErrors] = useState<{ hours: string, group: string }>({
        hours: "",
        group: ""
    });

    const [loading, setLoading] = useState<boolean>();

    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showNotification, setShowNotification] = useState<boolean>(false);

    // Utilisation de useEffect pour fermer la notification après 3 secondes
    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    const handleChangeNbrHour = (e: ChangeEvent<HTMLInputElement>) => {
        setDataToAssignProfessor({...dataToAssignProfessor, hours: Number(e.target.value)});
        if (isNaN(Number(e.target.value)) || Number(e.target.value) <= 0) {
            setErrors({...errors, hours: "Nombre d'heures invalide"});
        } else {
            setErrors({...errors, hours: ""});
        }
    }

    const handleChangeGroup = (e: ChangeEvent<HTMLSelectElement>) => {
        setDataToAssignProfessor({...dataToAssignProfessor, group: Number(e.target.value)});
        if (isNaN(Number(e.target.value)) || Number(e.target.value) <= 0) {
            setErrors({...errors, group: "Groupe invalide"});
        } else {
            setErrors({...errors, group: ""})
        }
    }

    const handleChangeNote = (e: ChangeEvent<HTMLInputElement>) => {
        setDataToAssignProfessor({...dataToAssignProfessor, notes: e.target.value});
    }

    const assignProfessor = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log(dataToAssignProfessor)
        const response = await AffectationAPI.assignCourseToProfile(dataToAssignProfessor);
        if (response.isError()) {
            console.log(response);
            setNotification({
                message: `Une erreur est survenue : ${response.errorMessage()}.`,
                type: 'alert-error'
            });
            setShowNotification(true);
        } else {
            setNotification({
                message: `Le cours est bien affecté au profile`,
                type: 'alert-success'
            });
            setShowNotification(true);
        }
        setLoading(false);
    }

    return (
        <div key={profile.id} className="w-full flex flex-col justify-between items-center">
            <div className="w-full flex items-center space-x-2">
                <h1 className="w-1/3 px-3 py-2 mt-1">{profile?.firstname} {profile?.lastname}</h1>
                <form className="w-full flex items-center space-x-2" onSubmit={assignProfessor}>
                    <input
                        id="note"
                        name="note"
                        type="text"
                        placeholder="Note sur l'affectation"
                        onChange={handleChangeNote}
                        value={dataToAssignProfessor.notes}
                        className="w-full py-2 px-3 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 mt-6"
                    />
                    <div>
                        <select
                            id="group"
                            name="group"
                            required
                            className="mr-2 px-3 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            onChange={(e) => handleChangeGroup(e)}
                            value={dataToAssignProfessor.group}>
                            <option value={0} disabled={true}>Groupe</option>
                            {
                                Array.from({length: groupCount}).map((_, index) => (
                                    <option key={index} value={index + 1}>{index + 1}</option>
                                ))
                            }
                        </select>

                    </div>
                    <div>
                        <input
                            id="nbrHour"
                            name="nbrHourToAffect"
                            type="number"
                            min={0}
                            required
                            className="[&::-webkit-inner-spin-button]:appearance-none w-20 px-3 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Heures"
                            value={dataToAssignProfessor.hours === 0 ? "" : dataToAssignProfessor.hours}
                            onChange={handleChangeNbrHour}
                        />

                    </div>
                    <button
                        type="submit"
                        className="ml-3 px-4 py-2 text-white rounded hover:border-green-300 bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                        Affecter
                    </button>
                </form>
            </div>
            {errors.group && <span className="text-sm text-red-500">{errors.group}</span>}
            {errors.hours && <span className="text-sm text-red-500">{errors.hours}</span>}
            {loading && <Loader />}
            {showNotification && <Notification message={notification.message} type={notification.type} />}
        </div>
    )
}

export default AffectationForm;