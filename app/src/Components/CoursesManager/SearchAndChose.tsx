import React, {ChangeEvent, useEffect, useState} from 'react';
import ProfileAPI from "../../scripts/API/ModelAPIs/ProfileAPI.ts";
import {Profile} from "../../scripts/API/APITypes/Profiles.ts";
import AffectationForm from "./AffectationForm.tsx";


interface SearchAndChoseProps {
    id_cours?: number,
    groupCount: number
}

function SearchAndChose({id_cours, groupCount}: SearchAndChoseProps) {
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchResult, setSearchResult] = useState<Profile[] | null>();
    const [loading, setLoading] = useState<boolean>();

    const [showSuggestions, setShowSuggestions] = useState<boolean>();

    const [, setNotification] = useState<{ message: string; type: string } | null>(null);
    const [, setShowNotification] = useState<boolean>(false);

    const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }

    useEffect(() => {
        setTimeout(async () => {
            if (searchInput.length > 0) {
                setShowSuggestions(true);
                await searchProfessors();
            } else {
                setShowSuggestions(false);
                setSearchResult(null);
            }
        }, 500)
    }, [searchInput])

    const searchProfessors = async () => {
        setLoading(true);
        const profilesResponse = await ProfileAPI.searchProfilesByKeywords(searchInput);
        if (profilesResponse.isError()) {
            setNotification({
                message: `Une erreur est survenue : ${profilesResponse.errorMessage()}.`,
                type: 'alert-error'
            });
            setShowNotification(true);
        } else {
            setSearchResult(profilesResponse.responseObject());
        }
        setLoading(false);
    }

    const selectProfessor = (professor: Profile) => {
        setShowSuggestions(false);
        setSearchResult([professor]);
    }

    const handleClickOnKey = async (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            setShowSuggestions(false);
            await searchProfessors();
        }
    };

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
                    id="search"
                    name="searchInput"
                    type="text"
                    className="w-full px-3 ps-10 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Recherche professeur par Nom et Prénom"
                    value={searchInput}
                    onChange={handleChangeSearchInput}
                    onKeyDown={e => handleClickOnKey(e)}
                />
                {showSuggestions && <div className="absolute bg-white border rounded shadow-lg z-10 w-full">
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
                </div>}

            </div>

            {!showSuggestions && loading && <div className="text-center">Recherche ...</div>}
            {!showSuggestions && !loading && searchResult?.length > 0 && searchResult?.map(profile => (
                <AffectationForm
                    profile={profile}
                    idCours={id_cours}
                    groupCount={groupCount}/>
            ))}
            {!showSuggestions && !loading && searchResult?.length == 0 &&
                <div className="text-center">Aucun résultat trouvé</div>}
        </div>
    );
}

export default SearchAndChose;