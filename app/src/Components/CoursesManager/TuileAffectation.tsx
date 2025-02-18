import { useState } from "react";
import AffectationAPI from "../../scripts/API/ModelAPIs/AffectationAPI.ts";

export default function TuileAffectation({ data, onRefresh }) {
    const { profile, hours, date, notes } = data;
    const formattedTime = new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedHours, setEditedHours] = useState(hours);
    const [editedNotes, setEditedNotes] = useState(notes);

    const handleEdit = () => {
        console.log(data);
        setIsEditing(true);
    };

    const handleSave = async () => {
        const body ={
            "affectation_id" : data.id,
            "profile_id": data.profile.id,
            "course_id": data.course_id,
            "hours": editedHours,
            "notes": editedNotes,
            "group": data.group,
        }

        await AffectationAPI.updateAffectationById(body);
        setIsEditing(false);
        onRefresh();
    };

    const handleDelete = () => {
        const detruireAffectation = async () => {
            await AffectationAPI.deleteAffectationById(data.id);
            onRefresh();
        };
        detruireAffectation();
    };

    return (
        <div className="border border-green-500 rounded-lg p-3 grid grid-cols-10 items-center w-full">
            <span className="font-semibold col-span-2 md:col-span-2">{profile.firstname} {profile.lastname}</span>
            <span className="text-gray-700 col-span-1 md:col-span-1">{hours}h</span>
            <span className="text-gray-500 col-span-3 md:col-span-3">{notes}</span>
            <span className="text-gray-500 col-span-1 md:col-span-1">{formattedTime}</span>
            <span className="text-gray-500 col-span-1 md:col-span-1"></span>
            <button onClick={handleEdit} className="col-span-1 md:col-span-1 bg-orange-500 text-white px-2 py-1 mr-2 rounded">Modifier</button>
            <button onClick={handleDelete} className="col-span-1 md:col-span-1 bg-red-500 text-white px-2 py-1 ml-2 rounded">Delete</button>

            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Modifier {profile.firstname} {profile.lastname}</h2>
                        <label className="block mb-2">Hours:
                            <input type="number" value={editedHours} onChange={(e) => setEditedHours(e.target.value)} className="w-full p-2 border rounded" />
                        </label>
                        <label className="block mb-2">Notes:
                            <input type="text" value={editedNotes} onChange={(e) => setEditedNotes(e.target.value)} className="w-full p-2 border rounded" />
                        </label>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Annuler</button>
                            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
