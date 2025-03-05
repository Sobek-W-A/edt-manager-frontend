import React, { useState, useEffect, useRef } from 'react';
import AcademicYearAPI from "../scripts/API/ModelAPIs/AcademicYearAPI";
import AcademicYearImportExportAPI from "../scripts/API/ModelAPIs/AcademicYearImportExportAPI";
import { AcademicYearType } from "../scripts/API/APITypes/AcademicYearType";

const AcademicYearsManagement: React.FC = () => {
    const [academicYears, setAcademicYears] = useState<AcademicYearType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchAcademicYears = async () => {
            setLoading(true);
            try {
                const response = await AcademicYearAPI.getAllAcademicYear();
                if (response.isError()) {
                    setError(response.errorMessage());
                } else {
                    setAcademicYears(response.responseObject());
                }
            } catch (err) {
                setError("Erreur lors du chargement des années académiques");
            }
            setLoading(false);
        };

        fetchAcademicYears();
    }, []);

    const handleCreateNextYear = async () => {
        try {
            const response = await AcademicYearAPI.createNextAcademicYear();
            if (!response.isError()) {
                const updatedResponse = await AcademicYearAPI.getAllAcademicYear();
                if (!updatedResponse.isError()) {
                    setAcademicYears(updatedResponse.responseObject());
                }
            }
        } catch (err) {
            setError("Erreur lors de la création de la nouvelle année");
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>, year: number) => {
        const file = event.target.files?.[0];
        if (!file) return;

        console.log(file)
        /*
        try {
            const response = await AcademicYearImportExportAPI.importAcademicYear(file);
            if (response.isError()) {
                setError(response.errorMessage());
            } else {
                // Rafraîchir la liste des années
                const updatedResponse = await AcademicYearAPI.getAllAcademicYear();
                if (!updatedResponse.isError()) {
                    setAcademicYears(updatedResponse.responseObject());
                }
                setError("Import réussi !");
            }
        } catch (err) {
            setError("Erreur lors de l'importation");
        }
        
        // Réinitialiser l'input file
        if (event.target) {
            event.target.value = '';
        }
            */
    };

    const handleExport = async (year: number) => {
        // Ne rien faire pour l'instant comme demandé
        console.log("Export clicked for year:", year);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Gestion des Années Académiques</h1>
            
            <button
                onClick={handleCreateNextYear}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-6"
            >
                Créer nouvelle année académique
            </button>

            {error && (
                <div className={`border px-4 py-3 rounded mb-4 ${
                    error === "Import réussi !" 
                    ? "bg-green-100 border-green-400 text-green-700"
                    : "bg-red-100 border-red-400 text-red-700"
                }`}>
                    {error}
                </div>
            )}

            {loading ? (
                <div>Chargement...</div>
            ) : (
                <div className="space-y-4">
                    {academicYears.map((year) => (
                        <div key={year.academic_year} 
                             className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                            <div>
                                <h2 className="text-xl font-semibold">{year.description}</h2>
                                <p className="text-gray-600">Année: {year.academic_year}</p>
                            </div>
                            <div className="space-x-4">
                                <input
                                    type="file"
                                    id={`import-${year.academic_year}`}
                                    onChange={(e) => handleImport(e, year.academic_year)}
                                    accept=".json"
                                    className="hidden"
                                    ref={fileInputRef}
                                />
                                <button
                                    onClick={() => document.getElementById(`import-${year.academic_year}`)?.click()}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Importer
                                </button>
                                <button
                                    onClick={() => handleExport(year.academic_year)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Exporter
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AcademicYearsManagement; 