import React, {ChangeEvent, useState} from 'react';
import ProfileAPI from "../../scripts/API/ModelAPIs/ProfileAPI.ts";
import {Profile} from "../../scripts/API/APITypes/Profiles.ts";

interface AssignProfessorFormData {
    nbrHourToAssign: number,
    group: string
}

function SearchAndChose() {
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchResult, setSearchResult] = useState<Profile[] | null>();
    const [loading, setLoading] = useState<boolean>();
    const [selectedProfessor, setSelectedProfessor] = useState<Profile>();

    const [, setNotification] = useState<{ message: string; type: string } | null>(null);
    const [, setShowNotification] = useState<boolean>(false);
    const [error, setError] = useState("");

    const [dataToAssignProfessor, setDataToAssignProfessor] = useState<AssignProfessorFormData>({
        nbrHourToAssign: 0,
        group: ""
    });

    const handleChangeSearchInput = async (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }

    const searchProfessors = async () => {
        setLoading(true);
        setError("");
        if(searchInput.length > 1) {
            const profilesResponse = await ProfileAPI.searchProfilesByKeywords(searchInput);
            if(profilesResponse.isError()) {
                setNotification({ message: `Une erreur est survenue : ${profilesResponse.errorMessage()}.`, type: 'alert-error' });
                setShowNotification(true);
            } else {
                setSearchResult(profilesResponse.responseObject());
            }
            setLoading(false);
        } else {
            setError("Veuillez commencer à saisir le nom ou le prénom")
            setSearchResult(null);
            setLoading(false);
        }
    }

    const handleChangeNbrHourToAffect = (e: ChangeEvent<HTMLInputElement>) => {
        setDataToAssignProfessor({...dataToAssignProfessor, nbrHourToAssign: Number(e.target.value)});
    }

    const handleChangeGroupe = (e: ChangeEvent<HTMLSelectElement>) => {
        setDataToAssignProfessor({...dataToAssignProfessor, group: e.target.value});
    }

    const selectProfessor = (professor: Profile) => {
        setSearchResult(null)
        setSelectedProfessor(professor);
    }

    const assignProfessor = () => {
        console.log("Assign professor");
    }

    return (
        <div className="w-full flex flex-col p-3">
            <div className="relative w-full mb-3 flex items-center">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input
                    id="search"
                    name="searchInput"
                    type="text"
                    className="w-full px-3 ps-10 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Recherche professeur par Nom et Prénom"
                    value={searchInput}
                    onChange={(e) => handleChangeSearchInput(e)}
                />
                <button
                    disabled={loading}
                    className="ml-3 px-4 py-2 text-white rounded hover:border-green-300 bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={searchProfessors}>Recherche</button>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {loading && <div className="text-center">Recherche ...</div>}
            {!loading && searchResult?.length > 0 && searchResult?.map(professor => (
                <div className="w-full flex flex-col justify-between items-center">
                    <div className="w-full flex justify-between items-center">
                        <h1 className="px-3 py-2 mt-1">{professor?.firstname} {professor?.lastname}</h1>
                        <div>
                            <select
                                id="group"
                                name="group"
                            required
                            className="mr-2 px-3 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={dataToAssignProfessor.group}
                            onChange={(e) => handleChangeGroupe(e)}>
                            <option>Veuillez choisir le groupe</option>
                            <option>TP</option>
                            <option>CM</option>
                            <option>TD</option>
                        </select>
                        <input
                            id="nbrHour"
                            name="nbrHourToAffect"
                            type="number"
                            min={0}
                            required
                            className="w-20 px-3 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Nombre d'heure à affecter"
                            value={dataToAssignProfessor.nbrHourToAssign}
                            onChange={(e) => handleChangeNbrHourToAffect(e)}
                        />
                        <button
                            onClick={assignProfessor}
                            className="ml-3 px-4 py-2 text-white rounded hover:border-green-300 bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                            Affecter
                        </button>
                    </div>
                </div>
            </div>))}
            {!loading && searchResult?.length == 0 && <div className="text-center">Aucun résultat trouvé</div>}
        </div>
    );
}

export default SearchAndChose;