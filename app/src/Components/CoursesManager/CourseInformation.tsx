import React from 'react';
import CollapsibleButton from './CollapsibleButton';
import SearchAndChose from "./SearchAndChose.tsx";

const UEExemple = {
    id: "ue503",
    name: "UE 503 BASES DE DONNÉES",
    durationTotale: 6,
    courses: [
        {CourseId : 1, type: "CM Bases", duration: 6},
        {CourseId : 2, type: "TP Bases", duration: 10, group_count : 1, groups : [{
                numeroGroupe: 1,


                //on l'aura en get après



                affectations:
                    [
                        {
                        teacher: {
                            profileId: 4,
                            firstname: "Jean",
                            lastname: "Lieber"
                        },
                        hours: 6
                        },
                        {
                            teacher: {
                                profileId: 5,
                                firstname: "Phuc",
                                lastname: "Ngo"
                            },
                            hours: 4
                        }
                    ]
            }]

        }
]
}

const CourseInformation: React.FC = () => {

    return (
        <div className="p-5">
            <div className="w-full text-center"><h1>{UEExemple.name}</h1></div>
            <div><p>durée totale de l'UE : {UEExemple.durationTotale}</p></div>

            <div>
                {UEExemple.courses.map((element) =>
                    <div className="form-field pt-5">
                        <div><p>{element.type}</p></div>
                        <div><p>Durée totale : {element.duration}</p></div>



                        <CollapsibleButton>
                        <SearchAndChose/>
                        </CollapsibleButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseInformation;