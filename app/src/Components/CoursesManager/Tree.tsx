import React, { useState } from "react";
import NodeAPI from "../../scripts/API/ModelAPIs/NodeAPI";
import { APINode } from "../../scripts/API/APITypes/Tree";
import { NodeInUpdate } from "../../scripts/API/APITypes/Tree";

type TreeNode = {
    academic_year: number;
    id: number;
    name: string;
    type: "node" | "ue";
    // Pour le rendu, on ne se sert pas de child_nodes (issu de l’API) mais de children (arborescence enrichie)
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

    // Chargement du noeud racine depuis le backend
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

    // Chargement d'un noeud par son ID (les données proviennent de l'API)
    const loadNodeChildren = async (nodeId: number, academicYear: number) => {
        try {
            const response = await NodeAPI.getNodeById(nodeId);
            if (response.isError()) {
                console.error(`Erreur lors du chargement du node ${nodeId}:`, response.errorMessage());
                return null;
            }
            return response.responseObject();
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API:", error);
            return null;
        }
    };

    // Fonction appelée lors du clic sur le bouton pour ouvrir/fermer un noeud
    const toggleNode = async (node: TreeNode) => {
        const nodeId = node.id.toString();

        if (node.type === "node") {
            if (!openNodes.has(nodeId)) {
                // Récupération du noeud depuis l'API (qui peut contenir des enfants sous forme d'identifiants ou d'objets)
                const updatedNode = await loadNodeChildren(node.id, node.academic_year);
                if (updatedNode) {
                    // Pour chaque élément de child_nodes, on gère deux cas :
                    // - Si c'est un nombre, on lance un appel pour récupérer le noeud correspondant.
                    // - Si c'est un objet (cas d'une UE ou d'un noeud déjà inclus), on le retourne directement.
                    const childrenNodes = await Promise.all(
                        (updatedNode.child_nodes || []).map(async (child: number | APINode) => {
                            if (typeof child === "number") {
                                return await loadNodeChildren(child, node.academic_year);
                            } else if (typeof child === "object" && child !== null) {
                                // Ici, le noeud enfant est déjà fourni (par exemple, une UE)
                                return child;
                            } else {
                                return null;
                            }
                        })
                    );

                    // Mise à jour de l'arborescence en ajoutant la propriété "children" avec les noeuds chargés
                    updateNodeInTree(node.id, {
                        ...updatedNode,
                        children: childrenNodes.filter((child) => child !== null)
                    });
                }
            }
        }

        setOpenNodes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };

    // Mise à jour d'un noeud dans l'arborescence (mise à jour récursive)
    const updateNodeInTree = (nodeId: number, updatedNode: TreeNode) => {
        if (!dataState) return;

        const updateNode = (node: TreeNode): TreeNode => {
            if (node.id === nodeId) {
                return updatedNode;
            }
            if (node.children) {
                return {
                    ...node,
                    children: node.children.map((child) => updateNode(child))
                };
            }
            return node;
        };

        setDataState(updateNode(dataState));
    };

    // Chargement initial des données lors du montage du composant
    React.useEffect(() => {
        chargementDonneeBackend();
    }, []);

    // Gestion du menu contextuel (affichage à la position du clic droit)
    const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
        e.preventDefault();
        const x = e.clientX;
        const y = e.clientY - 40;
        setContextMenu({ visible: true, x: x, y: y, nodeId: nodeId });
    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0, nodeId: null });
    };

    // Gestion des actions du menu contextuel (Ajouter Dossier, Ajouter UE, Supprimer, Renommer)
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

                    // Ajout optimiste du nouveau dossier dans l'arborescence
                    const parent = findNode(dataState, contextMenu.nodeId);
                    if (parent) {
                        const newFolderId = response.responseObject()?.id || Date.now();
                        const newFolder: TreeNode = {
                            academic_year: parent.academic_year,
                            id: newFolderId,
                            name: "Nouveau Dossier",
                            type: "node",
                            child_nodes: [],
                            children: []
                        };

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
                    academic_year: dataState.academic_year,
                    type: "ue",
                    id: Date.now(), // id temporaire
                    name: "Nouvelle UE",
                    child_nodes: []
                };
                const node = findNode(dataState, contextMenu.nodeId);
                if (node) {
                    if (!node.children) node.children = [];
                    node.children.push(newUe);
                    setDataState({ ...dataState });
                }
            } else if (action === "Supprimer") {
                try {
                    const response = await NodeAPI.deleteNode(dataState.academic_year, nodeIdNumber);
                    if (response.isError()) {
                        console.error("Erreur lors de la suppression du dossier:", response.errorMessage());
                        return;
                    }

                    if (dataState.id.toString() === contextMenu.nodeId) {
                        setDataState(null);
                    } else {
                        const parentNode = findParentNode(dataState, contextMenu.nodeId);
                        if (parentNode && parentNode.children) {
                            const index = parentNode.children.findIndex(
                                (child) => child.id.toString() === contextMenu.nodeId
                            );
                            if (index > -1) {
                                parentNode.children.splice(index, 1);
                                setDataState({ ...dataState });
                            }
                        }
                    }
                } catch (error) {
                    console.error("Erreur lors de la suppression du dossier:", error);
                }
            } else if (action === "Renommer") {
                const node = findNode(dataState, contextMenu.nodeId);
                if (node) {
                    setEditingNodeId(contextMenu.nodeId);
                    setNewNodeName(node.name);
                }
            }
            closeContextMenu();
        }
    };

    // Recherche récursive d'un noeud par son ID
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

    // Recherche récursive du parent d'un noeud donné
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

    // Passage en mode édition lors d'un double-clic
    const handleDoubleClick = (id: string, name: string) => {
        setEditingNodeId(id);
        setNewNodeName(name);
    };

    // Mise à jour du nom en local lors de la saisie
    const handleNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNodeName(e.target.value);
    };

    // Soumission du nouveau nom et envoi vers le backend
    const handleNodeNameSubmit = async (id: string) => {
        if (!dataState) return;
        const node = findNode(dataState, id);
        if (node) {
            const trimmedName = newNodeName.trim() === "" ? "default" : newNodeName.trim();
            try {
                const response = await NodeAPI.updateNode(node.academic_year, node.id, { name: trimmedName });
                if (response.isError()) {
                    console.error("Erreur lors de la mise à jour du nom:", response.errorMessage());
                } else {
                    node.name = trimmedName;
                    setDataState({ ...dataState });
                }
            } catch (error) {
                console.error("Erreur lors de l'appel à l'API de mise à jour:", error);
            }
        }
        setEditingNodeId(null);
    };

    // Rendu d'un noeud (ou UE) et de ses éventuels enfants
    const renderNode = (node: TreeNode) => {
        const isOpen = openNodes.has(node.id.toString());

        return (
            <div key={node.id} className="ml-4 relative">
                {isOpen && node.type === "node" && (
                    <div className="absolute left-[-5px] top-3 h-full w-[1px] bg-blue-300"></div>
                )}

                <div
                    className="flex items-center gap-2 cursor-pointer hover:text-gray-700"
                    onContextMenu={(e) => handleContextMenu(e, node.id.toString())}
                >
                    {node.type === "node" ? (
                        <button className="text-lg font-bold" onClick={() => toggleNode(node)}>
                            {isOpen ? "∨" : ">"}
                        </button>
                    ) : (
                        <span className="w-6">📚</span> // Icône pour les UE
                    )}
                    {editingNodeId === node.id.toString() ? (
                        <input
                            type="text"
                            value={newNodeName}
                            onChange={handleNodeNameChange}
                            onBlur={() => handleNodeNameSubmit(node.id.toString())}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleNodeNameSubmit(node.id.toString());
                                }
                            }}
                            className="text-lg font-semibold whitespace-nowrap"
                            autoFocus
                        />
                    ) : (
                        <span
                            className={`text-lg font-semibold whitespace-nowrap ${node.type === "ue" ? "text-blue-600" : ""}`}
                            onDoubleClick={() => handleDoubleClick(node.id.toString(), node.name)}
                            onClick={() => node.type === "ue" && onSelectCourse(node)}
                        >
              {node.name}
            </span>
                    )}
                </div>

                {isOpen && node.type === "node" && node.children && (
                    <div className="mt-2 ml-2">
                        {node.children.map((child) => renderNode(child))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="relative p-4 h-full" onClick={closeContextMenu}>
            <div className="flex-grow h-full">{dataState && renderNode(dataState)}</div>
            {contextMenu.visible && (
                <div
                    className="absolute bg-white border border-gray-300 rounded shadow-md"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button
                        className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                        onClick={() => handleAction("Renommer")}
                    >
                        Renommer
                    </button>
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
        </div>
    );
};

export default Tree;
