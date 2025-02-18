import {useEffect, useState} from 'react';
import AffectationAPI, {AffectationType} from "../../scripts/API/ModelAPIs/AffectationAPI.ts";
import TuileAffectation from "./TuileAffectation.tsx";


function AlreadyAffectedList(props: { course_id: number, refresh: () => never }) {

    const [affectationsResponse, setaffectationsResponse] = useState<(AffectationType)[]>();



    useEffect(() => {
        const fetchAffectationsParCours = async () => {
            const response = await AffectationAPI.getAffectationsByCourseId(props.course_id);
            setaffectationsResponse(response.responseObject())
        }

        fetchAffectationsParCours()

    });

    return (
        <div>
            {affectationsResponse?.map((affectation: AffectationType) => (
                <TuileAffectation
                    key={affectation.id}  // Ajout de la clé unique ici
                    data={affectation}
                    onRefresh={props.refresh}
                />
            ))}
        </div>
    );
}

export default AlreadyAffectedList;
