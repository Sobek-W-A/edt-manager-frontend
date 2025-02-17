import {useEffect, useState} from 'react';
import AffectationAPI, {AffectationType} from "../../scripts/API/ModelAPIs/AffectationAPI.ts";
import TuileAffectation from "./TuileAffectation.tsx";

function AlreadyAffectedList(props: { course_id: number; }) {

    const [affectationsResponse, setaffectationsResponse] = useState<(AffectationType)[]>();

    useEffect(() => {
        const fetchAffectationsParCours = async () => {
            const response = await AffectationAPI.getAffectationsByCourseId(props.course_id);
            //console.log(response.responseObject());
            setaffectationsResponse(response.responseObject())
        }

        fetchAffectationsParCours()

        console.log(affectationsResponse)
    }, []);

    return (
        <div>{affectationsResponse?.map((affectation : AffectationType) =>
            <TuileAffectation data = {affectation}></TuileAffectation>
        )}</div>
    );
}

export default AlreadyAffectedList;
