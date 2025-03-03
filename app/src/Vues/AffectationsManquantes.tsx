import React, { useEffect, useState } from "react";
import ProfileAPI from "../scripts/API/ModelAPIs/ProfileAPI.ts";
import UEAPI from "../scripts/API/ModelAPIs/UEAPI.ts";

interface AffectationProf {
    id: number;
    nom: string;
    matiere: string;
}

interface AffectationUE {
    id: number;
    ue: string;
    responsable: string;
}

const AffectationsManquantes: React.FC = () => {
    const [listeAffectationsManquantesProf, setListeAffectationsManquantesProf] = useState<AffectationProf[]>([]);
    const [listeAffectationsManquantesUE, setListeAffectationsManquantesUE] = useState<AffectationUE[]>([]);

    useEffect(() => {
        const fetchAffectationsProf = async () => {
            try {
                const response = await ProfileAPI.getAllProfilesWronglyAffected()
                const data = await response.responseObject();
                console.log(data);
                setListeAffectationsManquantesProf(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des affectations des professeurs", error);
            }
        };

        const fetchAffectationsUE = async () => {
            try {
                const response = await UEAPI.getAllUEWronglyAffected()
                const data = await response.responseObject();
                console.log(data);
                setListeAffectationsManquantesUE(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des affectations des UE", error);
            }
        };

        fetchAffectationsProf();
        fetchAffectationsUE();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Affectations Manquantes</h2>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Professeurs</h3>
                {listeAffectationsManquantesProf.length > 0 ? (
                    <ul className="list-disc ml-5">
                        {listeAffectationsManquantesProf.map((prof) => (
                            <li key={prof.id}>
                                {prof.nom} - {prof.matiere}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucune affectation manquante pour les professeurs.</p>
                )}
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Unités d'Enseignement (UE)</h3>
                {listeAffectationsManquantesUE.length > 0 ? (
                    <ul className="list-disc ml-5">
                        {listeAffectationsManquantesUE.map((ue) => (
                            <li key={ue.id}>
                                {ue.ue} - Responsable: {ue.responsable}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucune affectation manquante pour les unités d'enseignement.</p>
                )}
            </div>
        </div>
    );
};

export default AffectationsManquantes;
