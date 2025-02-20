import {useEffect, useState} from 'react';
import AffectationAPI, {AffectationType} from "../../scripts/API/ModelAPIs/AffectationAPI.ts";
import TuileAffectation from "./TuileAffectation.tsx";
import AffectationModel from "../../scripts/Models/AffectationModel.ts";


function AlreadyAffectedList(props: { course_id: number, refresh: () => never, group: number, refreshNumber: number, duree : number }) {

    const [affectationsResponse, setaffectationsResponse] = useState<(AffectationType)[]>();
    const [somme, setSomme] = useState(0);


    useEffect(() => {
        const fetchAffectationsParCours = async () => {
            const response = await AffectationAPI.getAffectationsByCourseId(props.course_id);
            // Filtrer les affectations par le group spécifié dans les props
            const filteredAffectations = response.responseObject().filter(
                (affectation: AffectationType) => affectation.group === props.group + 1
            );

            let s = 0
            filteredAffectations.forEach((affecation : AffectationType) => {
                s = s + affecation.hours
            })

            setSomme(s)
            setaffectationsResponse(filteredAffectations)


        }

        fetchAffectationsParCours()



    },[props.course_id, props.group, props.refreshNumber]);

    return (
        <div><p>groupe : {props.group+1} | </p>
            <p
                className={`
                ${somme === props.duree ? "text-green-500" : ""}
                ${somme > props.duree ? "text-red-500" : ""}
                ${somme < props.duree ? "text-blue-500" : ""}
            `}
            >
                assignées/total : {somme}/{props.duree}
            </p>

            {affectationsResponse?.map((affectation: AffectationType) => (
                <TuileAffectation
                    key={affectation.id}
                    data={affectation}
                    onRefresh={props.refresh}
                />
            ))}
        </div>
    );

}

export default AlreadyAffectedList;
