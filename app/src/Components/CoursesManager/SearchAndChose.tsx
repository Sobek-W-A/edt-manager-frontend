import React, {ChangeEvent, useState} from 'react';

interface AssignProfessorFormData {
    nbrHourToAssign: number,
    group: string
}

type ProfileType = {
    firstname: string,
    lastname: string
}

function SearchAndChose() {
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchResult, setSearchResult] = useState<ProfileType[] | null>();
    const [loading, setLoading] = useState<boolean>();
    const [selectedProfessor, setSelectedProfessor] = useState<ProfileType>();

    const [error, setError] = useState("");

    const [dataToAssignProfessor, setDataToAssignProfessor] = useState<AssignProfessorFormData>({
        nbrHourToAssign: 0,
        group: ""
    });

    const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        setLoading(true);

        if(searchInput.length > 1) {
            // TODO : Search professor
            setSearchResult([]);
            setLoading(false)
        } else {
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

    const selectProfessor = (professor: ProfileType) => {
        setSearchResult(null)
        setSelectedProfessor(professor);
    }

    const assignProfessor = () => {
        console.log("Assign professor");
    }

    return (
        <div className="w-full flex flex-col p-3">
            <div className="relative w-full mb-3">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input
                    id="nbrHour"
                    name="nbrHourToAffect"
                    type="text"
                    className="w-full px-3 ps-10 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Recherche professeur par Nom et Prénom"
                    value={searchInput}
                    onChange={(e) => handleChangeSearchInput(e)}
                />
                <div className="absolute bg-white border rounded shadow-lg z-10 w-full">
                    {loading && <div className="text-center">Recherche ...</div>}
                    {!loading && searchResult?.length > 0 && searchResult?.map((professor) => (
                        <div
                            key={professor.firstname}
                            className="px-3 py-2 hover:bg-green-100 cursor-pointer"
                            onClick={() => selectProfessor(professor)}
                        >
                            {professor.lastname} {professor.firstname}
                        </div>
                    ))}
                    {!loading && searchResult && searchResult?.length == 0 &&
                        <div className="text-center">Aucun résultat trouvé</div>}
                </div>
            </div>
            {selectedProfessor &&
                <div className="w-full flex flex-col justify-between items-center">
                    <div className="w-full flex justify-between items-center">
                        <h1 className="px-3 py-2 mt-1">{selectedProfessor?.firstname} {selectedProfessor?.lastname}</h1>
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
            </div>}
        </div>
    );
}

export default SearchAndChose;