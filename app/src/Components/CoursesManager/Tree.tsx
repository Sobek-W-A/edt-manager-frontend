import React, { useState } from "react";
import NodeAPI from "../../scripts/API/ModelAPIs/NodeAPI";
import { APINode } from "../../scripts/API/APITypes/Tree";
import { NodeInUpdate } from "../../scripts/API/APITypes/Tree";

type TreeNode = {
    academic_year: number;
    id: number;
    name: string;
    type: "node" | "ue";
    child_nodes: number[];
    children?: TreeNode[];
};

type TreeProps = {
    onSelectCourse: (course: TreeNode) => void;
};

const Tree: React.FC<TreeProps> = ({ onSelectCourse }) => {
    const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        nodeId: string | null;
    }>({ visible: false, x: 0, y: 0, nodeId: null });

    const [dataState, setDataState] = useState<TreeNode | null>(null);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [newNodeName, setNewNodeName] = useState<string>("");

    // Fonction pour charger les données depuis le backend
    const chargementDonneeBackend = async () => {
        try {
            const response = await NodeAPI.getRootNode(2024);
            if (response.isError()) {
                console.error("Erreur lors du chargement du node racine:", response.errorMessage());
            } else {
                const rootNode = response.responseObject();
                setDataState({
                    ...rootNode,
                    children: []
                });
            }
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API:", error);
        }
    };

    // Fonction pour charger les enfants d'un nœud
    const loadNodeChildren = async (nodeId: number, academicYear: number) => {
        try {
            const response = await NodeAPI.getNodeById(nodeId);
            if (response.isError()) {
                console.error(`Erreur lors du chargement des enfants du node ${nodeId}:`, response.errorMessage());
                return null;
            }
            return response.responseObject();
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API:", error);
            return null;
        }
    };

    // Fonction pour basculer l'état d'ouverture d'un nœud
    const toggleNode = async (node: TreeNode) => {
        const nodeId = node.id.toString();
        
        if (node.type === "node") {
            if (!openNodes.has(nodeId)) {
                // Chargement des données du nœud cliqué
                const updatedNode = await loadNodeChildren(node.id, node.academic_year);
                
                if (updatedNode) {
                    // Chargement des données de chaque nœud enfant
                    const childrenNodes = await Promise.all(
                        updatedNode.child_nodes.map(async (childId) => {
                            if (typeof childId === 'number') {
                                const childNode = await loadNodeChildren(childId, node.academic_year);
                                return childNode;
                            }
                            return null;
                        })
                    );

                    // Mise à jour de l'arborescence avec les données du nœud et ses enfants
                    updateNodeInTree(node.id, {
                        ...updatedNode,
                        children: childrenNodes.filter(child => child !== null) // Filtrer les résultats null
                    });
                }
            }
        }

        setOpenNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };

    // Fonction pour mettre à jour un nœud dans l'arborescence
    const updateNodeInTree = (nodeId: number, updatedNode: TreeNode) => {
        if (!dataState) return;

        const updateNode = (node: TreeNode): TreeNode => {
            if (node.id === nodeId) {
                return updatedNode;
            }
            if (node.children) {
                return {
                    ...node,
                    children: node.children.map(child => updateNode(child))
                };
            }
            return node;
        };

        setDataState(updateNode(dataState));
    };

    // Appel de la fonction lors du chargement du composant
    React.useEffect(() => {
        chargementDonneeBackend();
    }, []);

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
// Fonction pour gérer les actions du menu contextuel
    const handleAction = async (action: string) => {
        if (contextMenu.nodeId && dataState) {
            const nodeIdNumber = parseInt(contextMenu.nodeId);
            if (action === "Ajouter Dossier") {
                try {
                    const newNodeData: NodeInUpdate = {
                        name: "Nouveau Dossier",
                        parent_id: nodeIdNumber
                    };

                    const response = await NodeAPI.createNode(dataState.academic_year, newNodeData);

                    if (response.isError()) {
                        console.error("Erreur lors de la création du dossier:", response.errorMessage());
                        return;
                    }

                    // Mise à jour optimiste : ajout direct du nouveau dossier dans l'arborescence
                    const parent = findNode(dataState, contextMenu.nodeId);
                    if (parent) {
                        // Récupérer l'id du nouveau dossier retourné par l'API ou générer un id temporaire
                        const newFolderId = response.responseObject()?.id || Date.now();
                        const newFolder: TreeNode = {
                            academic_year: parent.academic_year,
                            id: newFolderId,
                            name: "Nouveau Dossier",
                            type: "node",
                            child_nodes: [],
                            children: [] // Initialisation du tableau des enfants
                        };

                        // Si le tableau des enfants n'existe pas, on l'initialise
                        if (!parent.children) {
                            parent.children = [];
                        }
                        parent.children.push(newFolder);
                        setDataState({ ...dataState });
                    }
                } catch (error) {
                    console.error("Erreur lors de la création du dossier:", error);
                }
            } else if (action === "Ajouter UE") {
                const newUe: TreeNode = {
                    type: "ue",
                    id: `ue-${Date.now()}`,
                    name: "Nouvelle UE",
                    child_nodes: [],
                };
                const node = findNode(dataState, contextMenu.nodeId);
                if (node) {
                    if (!node.children) node.children = [];
                    node.children.push(newUe);
                    setDataState({ ...dataState });
                }
            } else if (action === "Supprimer") {
                const parentNode = findParentNode(dataState, contextMenu.nodeId);
                if (parentNode && parentNode.children) {
                    const index = parentNode.children.findIndex(child => child.id.toString() === contextMenu.nodeId);
                    if (index > -1) {
                        parentNode.children.splice(index, 1);
                        setDataState({ ...dataState });
                    }
                }
            }
            closeContextMenu();
        }
    };

    // Fonction pour trouver un nœud par son ID
// Recherche récursive d'un nœud par son id (comparaison en chaîne)
    const findNode = (node: TreeNode, id: string): TreeNode | null => {
        if (node.id.toString() === id) return node;
        if (node.children) {
            for (const child of node.children) {
                const found = findNode(child, id);
                if (found) return found;
            }
        }
        return null;
    };

// Recherche récursive du nœud parent d'un nœud donné
    const findParentNode = (node: TreeNode, id: string): TreeNode | null => {
        if (node.children) {
            for (const child of node.children) {
                if (child.id.toString() === id) return node;
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
    const renderNode = (node: TreeNode) => {
        const isOpen = openNodes.has(node.id.toString());
        
        return (
            <div key={node.id} className="ml-4 relative">
                {isOpen && node.type === "node" && <div className="absolute left-[-5px] top-3 h-full w-[1px] bg-blue-300"></div>}

                <div 
                    className="flex items-center gap-2 cursor-pointer hover:text-gray-700" 
                    onContextMenu={(e) => handleContextMenu(e, node.id.toString())}
                >
                    {node.type === "node" ? (
                        <button 
                            className="text-lg font-bold" 
                            onClick={() => toggleNode(node)}
                        >
                            {isOpen ? "∨" : ">"}
                        </button>
                    ) : (
                        <span className="w-6">📚</span> // Icône pour les UEs
                    )}
                    <span 
                        className={`text-lg font-semibold whitespace-nowrap ${node.type === "ue" ? "text-blue-600" : ""}`}
                        onClick={() => node.type === "ue" && onSelectCourse(node)}
                    >
                        {node.name}
                    </span>
                </div>

                {isOpen && node.type === "node" && node.children && (
                    <div className="mt-2 ml-2">
                        {node.children.map((child) => renderNode(child))}
                    </div>
                )}
            </div>
        );
    };

    // Fonction pour valider les actions
    const handleValidate = () => {
        // TODO
        console.log("APPEL AU BACKEND");
    };

    return (
        <div className="relative p-4 h-full" onClick={closeContextMenu}>
            <div className="flex-grow h-full">
                {dataState && renderNode(dataState)}
            </div>
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
