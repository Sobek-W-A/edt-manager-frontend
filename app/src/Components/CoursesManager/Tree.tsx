import React, { useState } from "react";
import NodeAPI from "../../scripts/API/ModelAPIs/NodeAPI";

type Ue = {
    academic_year: string;
    id: string;
    name: string;
    type: "ue";
    child_nodes: Array<Node | Ue>;
};

type Node = {
    type: "node";
    id: string;
    name: string;
    children: Array<Node | Ue>;
    child_nodes: number[];
};

type TreeProps = {
    data: Node;
    onSelectCourse: (course: Ue) => void;
};

const data: Node = {
    type: "node",
    id: "root",
    name: "root",
    children: [
        {
            type: "node",
            id: "2024",
            name: "2024",
            children: [
                {
                    type: "node",
                    id: "2024-l3-info",
                    name: "L3-Informatique",
                    children: [
                        {
                            academic_year: "2024",
                            id: "5",
                            name: "UE 502 ALGORITHMIQUE-CONCEPTION PROGRAMMATION OBJET AVANCÉE",
                            type: "ue",
                            child_nodes: [],
                        },
                        {
                            academic_year: "2024",
                            id: "2",
                            name: "UE 503 BASES DE DONNÉES",
                            type: "ue",
                            child_nodes: [],
                        }
                    ],
                    child_nodes: [],
                }
            ],
            child_nodes: [],
        }
    ],
    child_nodes: [],
};

const Tree: React.FC<TreeProps> = ({ onSelectCourse }) => {
    const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        nodeId: string | null;
    }>({ visible: false, x: 0, y: 0, nodeId: null });

    const [dataState, setDataState] = useState<Node>(data);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [newNodeName, setNewNodeName] = useState<string>("");

    // Fonction pour charger les données depuis le backend
    const chargementDonneeBackend = async () => {
        try {
            const response = await NodeAPI.getNodeById(7);
            if (response.isError()) {
                console.error("Erreur lors du chargement du node 4:", response.errorMessage());
            } else {
                console.log("Node 4 chargé:", response.responseObject());
            }
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API:", error);
        }
    };

    // Appel de la fonction lors du chargement du composant
    React.useEffect(() => {
        chargementDonneeBackend();
    }, []);

    // Fonction pour basculer l'état d'ouverture d'un nœud
    const toggleNode = (id: string) => {
        setOpenNodes((prev) => {
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
    const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
        e.preventDefault();
        const x = e.clientX + 0;
        const y = e.clientY - 40;
        setContextMenu({ visible: true, x: x, y: y, nodeId: nodeId });
    };

    // Fonction pour fermer le menu contextuel
    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0, nodeId: null });
    };

    // Fonction pour gérer les actions du menu contextuel
    const handleAction = (action: string) => {
        if (contextMenu.nodeId) {
            const node = findNode(dataState, contextMenu.nodeId);
            if (action === "Ajouter Dossier") {
                const newNode: Node = {
                    type: "node",
                    id: `node-${Date.now()}`,
                    name: "Nouveau Dossier",
                    children: [],
                    child_nodes: [],
                };
                node.children.push(newNode);
            } else if (action === "Ajouter UE") {
                const newUe: Ue = {
                    academic_year: "2024",
                    id: `ue-${Date.now()}`,
                    name: "Nouvelle UE",
                    type: "ue",
                    child_nodes: [],
                };
                node.children.push(newUe);
            } else if (action === "Supprimer") {
                const parentNode = findParentNode(dataState, contextMenu.nodeId);
                if (parentNode) {
                    const index = parentNode.children.findIndex(child => child.id === contextMenu.nodeId);
                    if (index > -1) {
                        parentNode.children.splice(index, 1);
                    }
                }
            }
            setDataState({ ...dataState });
        }
        closeContextMenu();
    };

    // Fonction pour trouver un nœud par son ID
    const findNode = (node: Node, id: string): Node => {
        if (node.id === id) return node;
        for (const child of node.children) {
            if (child.type === "node") {
                const found = findNode(child, id);
                if (found) return found;
            }
        }
        return null!;
    };

    // Fonction pour trouver le nœud parent d'un nœud donné
    const findParentNode = (node: Node, id: string): Node | null => {
        for (const child of node.children) {
            if (child.id === id) return node;
            if (child.type === "node") {
                const found = findParentNode(child, id);
                if (found) return found;
            }
        }
        return null;
    };

    // Fonction pour gérer le double clic sur un nœud
    const handleDoubleClick = (id: string, name: string) => {
        setEditingNodeId(id);
        setNewNodeName(name);
    };

    // Fonction pour gérer le changement de nom d'un nœud
    const handleNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNodeName(e.target.value);
    };

    // Fonction pour soumettre le changement de nom d'un nœud
    const handleNodeNameSubmit = (id: string) => {
        const node = findNode(dataState, id);
        if (node) {
            node.name = newNodeName.trim() === "" ? "default" : newNodeName;
            setDataState({ ...dataState });
        }
        setEditingNodeId(null);
    };

    // Fonction pour rendre un nœud ou un cours
    const renderNode = (node: Node | Ue) => {
        if (node.type === "ue") {
            return (
                <div
                    key={node.id}
                    className="ml-8 mt-2 p-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md cursor-pointer min-h-[50px] min-w-[300px]"
                    onClick={() => onSelectCourse(node)}
                >
                    {node.name}
                </div>
            );
        } else {
            const isOpen = openNodes.has(node.id);
            return (
                <div key={node.id} className="ml-4 relative">
                    {isOpen && <div className="absolute left-[-5px] top-3 h-full w-[1px] bg-blue-300"></div>}

                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700" onContextMenu={(e) => handleContextMenu(e, node.id)}>
                        <button className="text-lg font-bold" onClick={() => toggleNode(node.id)}>
                            {isOpen ? "∨" : ">"}
                        </button>
                        {editingNodeId === node.id ? (
                            <input
                                type="text"
                                value={newNodeName}
                                onChange={handleNodeNameChange}
                                onBlur={() => handleNodeNameSubmit(node.id)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNodeNameSubmit(node.id)}
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
                            {node.children.map((child) => renderNode(child))}
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
            <div className="flex-grow h-full">{dataState.children.map((child) => renderNode(child))}</div>
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
