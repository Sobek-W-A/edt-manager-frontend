import React, {ChangeEvent, useState} from "react";

interface AssignProfessorFormData {
    courseId: number,
    profileId: number,
    hours: number,
    group: number,
    notes: string
}

function AffectationForm({profile}) {
    const [dataToAssignProfessor, setDataToAssignProfessor] = useState<AssignProfessorFormData>({
        courseId: 0,
        profileId: 0,
        hours: 0,
        group: 0,
        notes: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof AssignProfessorFormData, string>>>({
        hours: "",
        group: ""
    });
    const handleChangeNbrHour = (e: ChangeEvent<HTMLInputElement>) => {
        setDataToAssignProfessor({...dataToAssignProfessor, hours: Number(e.target.value)});
        if(isNaN(Number(e.target.value)) || Number(e.target.value) <= 0) {
            setErrors({...errors, hours: "Nombre d'heures invalide"});
        } else {
            setErrors({...errors, hours: ""});
        }
    }

    const handleChangeGroup = (e: ChangeEvent<HTMLSelectElement>) => {
        setDataToAssignProfessor({...dataToAssignProfessor, group: Number(e.target.value)});
        console.log(Number(e.target.value))
        if(isNaN(Number(e.target.value))) {
            setErrors({...errors, group: "Groupe invalide"});
        } else {
            setErrors({...errors, group: ""})
        }
    }

    const handleChangeNote = (e: ChangeEvent<HTMLInputElement>) => {
        setDataToAssignProfessor({...dataToAssignProfessor, notes: e.target.value});
    }

    /*const validateFormAssignProfessor = () => {
        if (!dataToAssignProfessor.hours || dataToAssignProfessor.hours <= 0) {
            setErrors({...errors, hours: "Nombre d'heures invalide"});
        }
        if (!dataToAssignProfessor.group || dataToAssignProfessor.group <= 0) {
            setErrors({...errors, group: "Groupe invalide"});
        }
    }*/

    const assignProfessor = () => {
        //validateFormAssign();
        console.log(errors);
        console.log(dataToAssignProfessor);
        console.log("Assign professor");
    }

    return (
        <div key={profile.id} className="w-full flex flex-col justify-between items-center">
            <div className="w-full flex items-center space-x-2">
                <h1 className="w-1/3 px-3 py-2 mt-1">{profile?.firstname} {profile?.lastname}</h1>

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
                        onChange={(e) => handleChangeGroup(e)}>
                        <option>Groupe</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
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
                        value={dataToAssignProfessor.hours}
                        onChange={handleChangeNbrHour}
                    />

                </div>
                <button
                    onClick={assignProfessor}
                    className="ml-3 px-4 py-2 text-white rounded hover:border-green-300 bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                    Affecter
                </button>

            </div>
            {errors.group && <span className="text-sm text-red-500">{errors.group}</span>}
            {errors.hours && <span className="text-sm text-red-500">{errors.hours}</span>}
        </div>
    )
}

export default AffectationForm;