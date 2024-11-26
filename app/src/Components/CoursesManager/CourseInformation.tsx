import React, { useState } from 'react';
import CollapsibleButton from './CollapsibleButton';
import SearchAndChose from "./SearchAndChose.tsx";

// Exemple d'UE (comme dans votre code initial)
const UEExemple = {
    id: "ue503",
    name: "UE 503 BASES DE DONNÉES",
    durationTotale: 6,
    courses: [
        { CourseId: 1, type: "CM Bases", duration: 6 },
        { CourseId: 2, type: "TP Bases", duration: 10, group_count: 1, groups: [{
                numeroGroupe: 1,
                affectations: [
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
};

const CourseInformation: React.FC = () => {
    // Créer un état pour gérer le nom modifiable
    const [ueName, setUeName] = useState<string>(UEExemple.name);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // Fonction pour activer l'édition sur double-clic
    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    // Fonction pour gérer le changement de texte
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUeName(e.target.value);
    };

    // Fonction pour arrêter l'édition (par exemple, en appuyant sur Entrée ou en quittant le champ d'entrée)
    const handleBlur = () => {
        setIsEditing(false);
        // Vous pouvez ajouter ici une logique pour enregistrer les changements si nécessaire (ex: API call)
    };

    return (
        <div className="p-5">
            <div className="w-full text-center">
                {/* Afficher l'input si on est en mode édition */}
                {isEditing ? (
                    <input
                        type="text"
                        value={ueName}
                        onChange={handleChange}
                        onBlur={handleBlur} // Sortie du mode édition
                        autoFocus // Met le focus directement dans l'input
                        className="text-center border-b-2 border-blue-500"
                    />
                ) : (
                    // Afficher le nom comme texte, avec un gestionnaire de double-clic
                    <h1 onDoubleClick={handleDoubleClick} className="cursor-pointer">
                        {ueName}
                    </h1>
                )}
            </div>

            <div>
                {UEExemple.courses.map((element, index) => (
                    <div key={index} className="form-field pt-5">
                        <div><p>{element.type}</p></div>
                        <div><p>Durée totale : {element.duration}</p></div>

                        <CollapsibleButton>
                            <SearchAndChose />
                        </CollapsibleButton>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseInformation;