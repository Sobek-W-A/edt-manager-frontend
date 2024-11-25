import React from "react";
import ProfessorForm from "../Components/Professor/ProfessorForm";

interface ProfessorFormData {
    lastname: string;
    firstname: string;
    email: string;
    phoneNumber: string;
    numberHoursToAssign: number;
    status: string;
}

const ProfessorVue: React.FC = () => {

    const [formData, setFormData] = React.useState<ProfessorFormData>(
        {
            lastname: "",
            firstname: "",
            email: "",
            phoneNumber: "",
            numberHoursToAssign: 0,
            status: "",
        }
    );

    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const inputValidators: Record<string, (value: string | number) => string> = {

        lastname: (value) => typeof value == "string" && value.length >= 2 ? "" : "Veuillez entrer un nom valide, d'au moins 2 caractères.",

        firstname: (value) => typeof value == "string" && value.length >= 2 ? "" : "Veuillez entrer un prénom valide, d'au moins 2 caractères.",

        email: (value) => typeof value === "string" && /\S+@\S+\.\S+/.test(value) ? "" : "Veuillez entrer une adresse email valide.",

        phoneNumber: (value) => typeof value == "string" && /^\d{10}$/.test(value) ? "" : "Veuillez entrer un numéro de téléphone valide.",

        numberHoursToAssign: (value) => Number(value) > 0 ? "" : "Veuillez entrer numéro d'heures valide ",

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
        <div className="flex flex-col justify-center items-center pt-12 pb-12">
            <div className="w-full max-w-2xl p-2 space-y-6 rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Ajouter un professeur</h1>
            </div>
                <ProfessorForm
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    inputValidators={inputValidators}
                    onSubmit={handleSubmit}/>
            </div>
        </div>
    )
}

export default ProfessorVue;