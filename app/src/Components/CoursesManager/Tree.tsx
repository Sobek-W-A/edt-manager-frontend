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

type TreeProps = {
    data: Folder;
    onSelectCourse: (course: Course) => void;
};
const data: Folder = {
    type: "folder",
    id: "root",
    name: "root",
    children: [
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


const Tree: React.FC<TreeProps> = ({ onSelectCourse }) => {
    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        folderId: string | null;
    }>({ visible: false, x: 0, y: 0, folderId: null });

    const [dataState, setDataState] = useState<Folder>(data);
    const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
    const [newFolderName, setNewFolderName] = useState<string>("");

    // Fonction pour charger les données depuis le backend
    const chargementDonneeBackend = () => {
        // TODO: Implémenter la logique pour charger les données depuis le backend dans data
    };

    // Appel de la fonction lors du chargement du composant
    React.useEffect(() => {
        chargementDonneeBackend();
    }, []);

    // Fonction pour basculer l'état d'ouverture d'un dossier
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

    // Fonction pour gérer le menu contextuel
    const handleContextMenu = (e: React.MouseEvent, folderId: string) => {
        e.preventDefault();
        const menuWidth = 200;
        const menuHeight = 100;
        const x = e.clientX + 0;
        const y = e.clientY - 40;
        setContextMenu({ visible: true, x: x, y: y, folderId });
    };

    // Fonction pour fermer le menu contextuel
    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0, folderId: null });
    };

    // Fonction pour gérer les actions du menu contextuel
    const handleAction = (action: string) => {
        if (contextMenu.folderId) {
            const folder = findFolder(dataState, contextMenu.folderId);
            if (action === "Ajouter Dossier") {
                const newFolder: Folder = {
                    type: "folder",
                    id: `folder-${Date.now()}`,
                    name: "Nouveau Dossier",
                    children: [],
                };
                folder.children.push(newFolder);
            } else if (action === "Ajouter UE") {
                const newCourse: Course = {
                    type: "course",
                    id: `course-${Date.now()}`,
                    title: "Nouvelle UE",
                    department: "Informatique",
                    responsible: "Professeur Inconnu",
                    hoursUnassigned: 0,
                    sessions: [],
                };
                folder.children.push(newCourse);
            } else if (action === "Supprimer") {
                const parentFolder = findParentFolder(dataState, contextMenu.folderId);
                if (parentFolder) {
                    const index = parentFolder.children.findIndex(child => child.id === contextMenu.folderId);
                    if (index > -1) {
                        parentFolder.children.splice(index, 1);
                    }
                }
            }
            setDataState({ ...dataState });
        }
        closeContextMenu();
    };

    // Fonction pour trouver un dossier par son ID
    const findFolder = (node: Folder, id: string): Folder => {
        if (node.id === id) return node;
        for (const child of node.children) {
            if (child.type === "folder") {
                const found = findFolder(child, id);
                if (found) return found;
            }
        }
        return null!;
    };

    // Fonction pour trouver le dossier parent d'un dossier donné
    const findParentFolder = (node: Folder, id: string): Folder | null => {
        for (const child of node.children) {
            if (child.id === id) return node;
            if (child.type === "folder") {
                const found = findParentFolder(child, id);
                if (found) return found;
            }
        }
        return null;
    };

    // Fonction pour gérer le double clic sur un dossier
    const handleDoubleClick = (id: string, name: string) => {
        setEditingFolderId(id);
        setNewFolderName(name);
    };

    // Fonction pour gérer le changement de nom d'un dossier
    const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFolderName(e.target.value);
    };

    // Fonction pour soumettre le changement de nom d'un dossier
    const handleFolderNameSubmit = (id: string) => {
        const folder = findFolder(dataState, id);
        if (folder) {
            folder.name = newFolderName.trim() === "" ? "default" : newFolderName;
            setDataState({ ...dataState });
        }
        setEditingFolderId(null);
    };

    // Fonction pour rendre un dossier ou un cours
    const renderFolder = (node: Folder | Course) => {
        if (node.type === "course") {
            return (
                <div
                    key={node.id}
                    className="ml-8 mt-2 p-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md cursor-pointer min-h-[50px] min-w-[300px]"
                    onClick={() => onSelectCourse(node)}
                >
                    {node.title}
                </div>
            );
        } else {
            const isOpen = openFolders.has(node.id);
            return (
                <div key={node.id} className="ml-4 relative">
                    {isOpen && <div className="absolute left-[-5px] top-3 h-full w-[1px] bg-blue-300"></div>}

                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700" onContextMenu={(e) => handleContextMenu(e, node.id)}>
                        <button className="text-lg font-bold" onClick={() => toggleFolder(node.id)}>
                            {isOpen ? "∨" : ">"}
                        </button>
                        {editingFolderId === node.id ? (
                            <input
                                type="text"
                                value={newFolderName}
                                onChange={handleFolderNameChange}
                                onBlur={() => handleFolderNameSubmit(node.id)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFolderNameSubmit(node.id)}
                                className="text-lg font-semibold"
                            />
                        ) : (
                            <span
                                className="text-lg font-semibold whitespace-nowrap"
                                onDoubleClick={() => handleDoubleClick(node.id, node.name)}
                            >
                                {node.name}
                            </span>
                        )}
                    </div>
                    {isOpen && (
                        <div className="mt-2 ml-2">
                            {node.children.map((child) => renderFolder(child))}
                        </div>
                    )}
                </div>
            );
        }
    };

    // Fonction pour valider les actions
    const handleValidate = () => {
        // TODO
        console.log("APPEL AU BACKEND");
    };

    return (
        <div className="relative p-4 h-full" onClick={closeContextMenu}>
            <div className="flex-grow h-full">{dataState.children.map((child) => renderFolder(child))}</div>
            {contextMenu.visible && (
                <div
                    className="absolute bg-white border border-gray-300 rounded shadow-md"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button
                        className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                        onClick={() => handleAction("Ajouter Dossier")}
                    >
                        Ajouter Dossier
                    </button>
                    <button
                        className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                        onClick={() => handleAction("Ajouter UE")}
                    >
                        Ajouter UE
                    </button>
                    <button
                        className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                        onClick={() => handleAction("Supprimer")}
                    >
                        Supprimer
                    </button>
                </div>
            )}
            <div className="flex justify-center mt-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleValidate}>
                    Valider
                </button>
            </div>
        </div>
    );
};

export default Tree;
