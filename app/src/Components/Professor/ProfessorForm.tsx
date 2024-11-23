import React, { Dispatch, SetStateAction } from "react";
import Input from "../Utils/Input";

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

interface ProfessorFormProps {
    formData: ProfessorFormData,
    setFormData: Dispatch<SetStateAction<ProfessorFormData>>,
    errors: Record<string, string>,
    setErrors: Dispatch<SetStateAction<Record<string, string>>>,
    inputValidators: Record<string, (value: string | number) => string>,
    onSubmit: (e: React.FormEvent) => void,
}

const ProfessorForm: React.FC<ProfessorFormProps> = ({formData, setFormData, errors, setErrors, inputValidators, onSubmit}) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setFormData({...formData, [name]: value});
    
        if (inputValidators[name]) {
          const error = inputValidators[name](value);
          setErrors((prev) => ({
            ...prev,
            [name]: error,
          }));
        }
    };

    return (
        <div className="form-group space-y-6 p-8">
            <div className="flex gap-6">
                <div className="flex-1">
                    <Input
                        label="Nom"
                        type="text"
                        placeholder="Nom"
                        name="lastname"
                        error={errors.lastname}
                        value={formData.lastname}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex-1">
                    <Input
                        label="Prénom"
                        type="text"
                        placeholder="Prénom"
                        name="firstname"
                        error={errors.firstname}
                        value={formData.firstname}
                        onChange={handleChange}
                    />
                </div>
            </div>
            
            <div className="flex gap-4">
                <div className="flex-1">
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="mail@example.com"
                        error={errors.email}
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex-1">
                    <Input
                        label="Numéro de téléphone"
                        type="tel"
                        name="phoneNumber"
                        placeholder="0600000000"
                        error={errors.phoneNumber}
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
            </div>
            
            <div className="flex gap-4">
                <div className="flex-1">
                    <Input
                        label="Département"
                        type="text"
                        name="departement"
                        placeholder="Département"
                        error={errors.departement}
                        value={formData.departement}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex-1">
                    <Input
                        label="Nombre d'heure à affecter"
                        type="number"
                        name="numberHoursToAssign"
                        placeholder="192"
                        error={errors.numberHoursToAssign}
                        value={formData.numberHoursToAssign}
                        onChange={handleChange}
                    />
                </div>
            </div>
            
            <div className="flex gap-4">
                <div className="flex-1">
                    <Input
                        label="Spécialité"
                        type="text"
                        name="speciality"
                        placeholder="Informatique"
                        error={errors.speciality}
                        value={formData.speciality}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex-1">
                    <Input
                        label="Status"
                        type="text"
                        name="status"
                        placeholder="Status"
                        error={errors.status}
                        value={formData.status}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    type="button"
                    className="px-4 py-2 text-white rounded hover:border-green-300 bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={onSubmit}
                >
                    Ajouter
                </button>
            </div>
        </div>

    )
}

export default ProfessorForm;