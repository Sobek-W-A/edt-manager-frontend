import React, { useState } from "react";

type Course = {
    type: "course";
    id: string;
    title: string;
    department: string;
    responsible: string;
    hoursUnassigned: number;
    sessions: {
        type: string;
        hours: number;
        assigned: boolean;
        teacher?: string;
    }[];
};

type Folder = {
    type: "folder";
    id: string;
    name: string;
    children: Array<Folder | Course>;
};

type ModuleProps = {
    data: Folder;
    onSelectCourse: (course: Course) => void;
};

// Données JSON écrites en dur
const data: Folder = {
    type: "folder",
    id: "root",
    name: "root",
    children: [
        {
            type: "folder",
            id: "2023",
            name: "2023",
            children: [
                {
                    type: "folder",
                    id: "2023-l3-info",
                    name: "L3-Informatique",
                    children: [
                        {
                            type: "course",
                            id: "ue501",
                            title: "UE 501 LOGIQUE",
                            department: "Informatique",
                            responsible: "Jean Lieber",
                            hoursUnassigned: 5,
                            sessions: [
                                { type: "CM Logique", hours: 5, assigned: false },
                                { type: "TP Logique", hours: 10, teacher: "Jean Lieber", assigned: true }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: "folder",
            id: "2024",
            name: "2024",
            children: [
                {
                    type: "folder",
                    id: "2024-l3-info",
                    name: "L3-Informatique",
                    children: [
                        {
                            type: "course",
                            id: "ue502",
                            title: "UE 502 ALGORITHMIQUE-CONCEPTION PROGRAMMATION OBJET AVANCÉE",
                            department: "Informatique",
                            responsible: "Horatiu",
                            hoursUnassigned: 12,
                            sessions: [
                                { type: "CM Logique", hours: 12, assigned: false },
                                { type: "TP1 Logique", hours: 10, teacher: "Jean Lieber", assigned: true },
                                { type: "TP2 Logique", hours: 10, teacher: "Didier Galmiche", assigned: true }
                            ]
                        },
                        {
                            type: "course",
                            id: "ue503",
                            title: "UE 503 BASES DE DONNÉES",
                            department: "Informatique",
                            responsible: "Horatiu",
                            hoursUnassigned: 6,
                            sessions: [
                                { type: "CM Bases", hours: 6, assigned: false },
                                { type: "TP Bases", hours: 10, teacher: "Jean Lieber", assigned: true }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

const Module: React.FC<ModuleProps> = ({ onSelectCourse }) => {
    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

    const toggleFolder = (id: string) => {
        setOpenFolders((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const renderFolder = (node: Folder | Course) => {
        if (node.type === "course") {
            return (
                <div
                    key={node.id}
                    className="ml-8 mt-2 p-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md cursor-pointer"
                    onClick={() => onSelectCourse(node)}
                >
                    {node.title}
                </div>
            );
        } else {
            const isOpen = openFolders.has(node.id);
            return (
                <div key={node.id} className="ml-4">
                    {/* Bouton et titre du dossier */}
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:text-gray-700"
                        onClick={() => toggleFolder(node.id)}
                    >
                        <button className="text-lg font-bold">
                            {isOpen ? "∨" : ">"}
                        </button>
                        <span className="text-lg font-semibold">{node.name}</span>
                    </div>

                    {/* Contenu du dossier */}
                    {isOpen && (
                        <div className="mt-2">
                            {node.children.map((child) => renderFolder(child))}
                        </div>
                    )}
                </div>
            );
        }
    };

    return <div className="p-4">{data.children.map((child) => renderFolder(child))}</div>;
};

export default Module;
