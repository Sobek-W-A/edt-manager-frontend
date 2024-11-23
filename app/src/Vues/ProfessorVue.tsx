import React from "react";
import ProfessorForm from "../Components/Professor/ProfessorForm";

interface ProfessorFormData {
    lastname: string;
    firstname: string;
    email: string;
    phoneNumber: string;
    departement: string;
    numberHoursToAssign: number;
    speciality: string;
    status: string;
}

const ProfessorVue: React.FC = () => {

    const [formData, setFormData] = React.useState<ProfessorFormData>(
        {
            lastname: "",
            firstname: "",
            email: "",
            phoneNumber: "",
            departement: "",
            numberHoursToAssign: 0,
            speciality: "",
            status: "",
        }
    );

    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const inputValidators: Record<string, (value: string | number) => string> = {

        lastname: (value) => typeof value == "string" && value.length >= 2 ? "" : "Veuillez entrer un nom valide, d'au moins 2 caractères.",

        firstname: (value) => typeof value == "string" && value.length >= 2 ? "" : "Veuillez entrer un prénom valide, d'au moins 2 caractères.",

        email: (value) => typeof value === "string" && /\S+@\S+\.\S+/.test(value) ? "" : "Veuillez entrer une adresse email valide.",

        phoneNumber: (value) => typeof value == "string" && /^\d{10}$/.test(value) ? "" : "Veuillez entrer un numéro de téléphone valide.",

        departement: (value) => typeof value == "string" && value.length >= 2 ? "" : "Veuillez entrer un département valide.",

        numberHoursToAssign: (value) => typeof value == "number" && value > 0 ? "" : "Veuillez entrer numéro d'heures valide",

        speciality: (value) => typeof value == "string" && value.length >= 2 ? "" : "Veuillez entrer une spécialité valide",

        status: (value) => typeof value == "string" && value.length >= 2 ? "" : "Veuillez choisir un status valide",
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        Object.keys(inputValidators).forEach((key) => {
            const error = inputValidators[key](formData[key as keyof typeof formData]);
            if (error) {
                newErrors[key] = error;
            }
        });
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            // TODO: envoyer le formulaire
            console.log("Envoyer le formulaire en backend");
        }
    }

    return(
        <ProfessorForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            inputValidators={inputValidators}
            onSubmit={handleSubmit}/>
    )
}

export default ProfessorVue;