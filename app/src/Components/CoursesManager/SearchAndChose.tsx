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
    const profiles: ProfileType[] = [
        {
            firstname: "Julian",
            lastname: "Provillard"
        },
        {
            firstname: "firstname1",
            lastname: "lastname1"
        }];
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchResult, setSearchResult] = useState<ProfileType[] | null>();
    const [loading, setLoading] = useState<boolean>();

    const [error, setError] = useState("");

    const [dataToAssignProfessor, setDataToAssignProfessor] = useState<AssignProfessorFormData>({
        nbrHourToAssign: 0,
        group: ""
    });

    const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        setLoading(true);
        // TODO : GET Professeurs
        if(searchInput.length > 2) {
            setSearchResult(profiles.filter(
                (profile) => profile.lastname.toLowerCase().includes(searchInput.toLowerCase())));
        } else {
            setSearchResult(null)
        }
        setLoading(false);
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

                        >
                            {professor.lastname} {professor.firstname}
                        </div>
                    ))}
                    {!loading && searchResult && searchResult?.length == 0 &&
                        <div className="text-center">Aucun résultat trouvé</div>}
                </div>
            </div>
        </div>
    );
}

export default SearchAndChose;