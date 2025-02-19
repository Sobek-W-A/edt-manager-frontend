import React, { useState, useEffect } from "react";
import NodeAPI from "../../scripts/API/ModelAPIs/NodeAPI";
import UEAPI from "../../scripts/API/ModelAPIs/UEAPI";
import { APINode } from "../../scripts/API/APITypes/Tree";
import { NodeInUpdate } from "../../scripts/API/APITypes/Tree";
import {UEInCreation, UeInUpdate} from "../../scripts/API/APITypes/UE.ts";

type TreeNode = {
    academic_year: number;
    id: number;
    name: string;
    type: "node" | "ue";
    // Pour le rendu, on ne se sert pas de child_nodes (issu de l’API) mais de children (arborescence enrichie)
    child_nodes: number[] | any[];
    children?: TreeNode[];
};

type TreeProps = {
    onSelectCourse: (course: TreeNode) => void;
};

// Génère une clé unique pour un nœud en combinant son type et son id
const getNodeKey = (node: TreeNode) => `${node.type}-${node.id}`;

/**
 * Recharge un nœud et ses enfants si la clé du nœud figure dans openNodesSet.
 * La fonction se fait de façon récursive sur les enfants.
 */
const refreshOpenNodes = async (
    node: TreeNode,
    openNodesSet: Set<string>,
    loadNodeChildren: (nodeId: number, academicYear: number) => Promise<any>
): Promise<TreeNode> => {
    let updatedNode = node;
    // Si le nœud est de type "node" et qu'il est marqué comme ouvert, on recharge ses données (et donc ses enfants)
    if (node.type === "node" && openNodesSet.has(getNodeKey(node))) {
        const updatedData = await loadNodeChildren(node.id, node.academic_year);
        if (updatedData) {
            const childrenNodes = await Promise.all(
                (updatedData.child_nodes || []).map(async (child: number | APINode) => {
                    if (typeof child === "number") {
                        return await loadNodeChildren(child, node.academic_year);
                    } else if (typeof child === "object" && child !== null) {
                        if ("courses" in child) {
                            return { ...child, type: "ue" };
                        }
                        return child;
                    } else {
                        return null;
                    }
                })
            );
            updatedNode = {
                ...updatedData,
                children: childrenNodes.filter((child) => child !== null)
            };
        }
    }
    // Ensuite, si le nœud possède des enfants, on applique la fonction de façon récursive
    if (updatedNode.children) {
        const refreshedChildren = await Promise.all(
            updatedNode.children.map((child) =>
                refreshOpenNodes(child, openNodesSet, loadNodeChildren)
            )
        );
        updatedNode = { ...updatedNode, children: refreshedChildren };
    }
    return updatedNode;
};

const Tree: React.FC<TreeProps> = ({ onSelectCourse }) => {
    const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        nodeKey: string | null;
    }>({ visible: false, x: 0, y: 0, nodeKey: null });
    const [dataState, setDataState] = useState<TreeNode | null>(null);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [newNodeName, setNewNodeName] = useState<string>("");

    // Année académique initialisée depuis le sessionStorage (ou "2024" par défaut)
    const [academicYear, setAcademicYear] = useState<string>(
        window.sessionStorage.getItem("academic_year") || "2024"
    );

    // Recharge la racine depuis l'API et, si des nœuds étaient ouverts, on les rafraîchit via refreshOpenNodes
    const chargementDonneeBackend = async () => {
        try {
            const year = parseInt(academicYear, 10);
            const response = await NodeAPI.getRootNode(year);
            if (response.isError()) {
                console.error("Erreur lors du chargement du node racine:", response.errorMessage());
            } else {
                const rootNode = response.responseObject();
                let initialTree: TreeNode = { ...rootNode, children: [] };
                const currentOpenNodes = new Set(openNodes);
                if (currentOpenNodes.size > 0) {
                    initialTree = await refreshOpenNodes(initialTree, currentOpenNodes, loadNodeChildren);
                }
                setDataState(initialTree);
            }
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API:", error);
        }
    };

    // Recharge la racine (ainsi que les nœuds ouverts) quand l'année académique change
    useEffect(() => {
        chargementDonneeBackend();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [academicYear]);

    // Détection des modifications dans le sessionStorage provenant d'autres onglets
    useEffect(() => {
        const handleStorageChange = () => {
            const storedYear = window.sessionStorage.getItem("academic_year");
            if (storedYear && storedYear !== academicYear) {
                setAcademicYear(storedYear);
                console.log("Storage event:", storedYear);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [academicYear]);

    // Détection des modifications dans le même onglet en surchargeant sessionStorage.setItem
    useEffect(() => {
        const handleSessionStorageChange = () => {
            const storedYear = window.sessionStorage.getItem("academic_year");
            setAcademicYear((prev) =>
                storedYear && storedYear !== prev ? storedYear : prev
            );
        };

        const originalSetItem = sessionStorage.setItem;
        sessionStorage.setItem = function (key: string, value: string) {
            originalSetItem.apply(this, arguments);
            if (key === "academic_year") {
                handleSessionStorageChange();
            }
        };

        return () => {
            sessionStorage.setItem = originalSetItem;
        };
    }, []);

    // Fonction pour charger les enfants d'un nœud par son ID
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

    // Fonction appelée lors du clic pour basculer l'ouverture/fermeture d'un nœud
    const toggleNode = async (node: TreeNode) => {
        const nodeKey = getNodeKey(node);
        const newSet = new Set(openNodes);
        if (newSet.has(nodeKey)) {
            // Fermeture : on retire uniquement la clé du nœud parent (les clés des enfants restent conservées)
            newSet.delete(nodeKey);
            setOpenNodes(newSet);
        } else {
            // Ouverture : on ajoute la clé du nœud parent
            newSet.add(nodeKey);
            setOpenNodes(newSet);
            // Puis on recharge le nœud en utilisant refreshOpenNodes pour que les enfants qui étaient ouverts soient également rafraîchis
            const refreshed = await refreshOpenNodes(node, newSet, loadNodeChildren);
            updateNodeInTree(node.id, refreshed);
        }
    };

    // Mise à jour d'un nœud dans l'arborescence (de manière récursive)
    const updateNodeInTree = (nodeId: number, updatedNode: TreeNode) => {
        if (!dataState) return;
        const updateNode = (node: TreeNode): TreeNode => {
            if (node.id === nodeId && node.type === updatedNode.type) {
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

    // Gestion du menu contextuel
    const handleContextMenu = (e: React.MouseEvent, nodeKey: string) => {
        e.preventDefault();
        e.stopPropagation();
        const x = e.clientX;
        const y = e.clientY - 40;
        setContextMenu({ visible: true, x, y, nodeKey });
    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0, nodeKey: null });
    };

    // Recherche récursive d'un nœud par sa clé composite
    const findNode = (node: TreeNode, compositeKey: string): TreeNode | null => {
        if (getNodeKey(node) === compositeKey) return node;
        if (node.children) {
            for (const child of node.children) {
                const found = findNode(child, compositeKey);
                if (found) return found;
            }
        }
        return null;
    };

    // Recherche récursive du parent d'un nœud via sa clé composite
    const findParentNode = (node: TreeNode, compositeKey: string): TreeNode | null => {
        if (node.children) {
            for (const child of node.children) {
                if (getNodeKey(child) === compositeKey) return node;
                const found = findParentNode(child, compositeKey);
                if (found) return found;
            }
        }
        return null;
    };

    // Gestion des actions du menu contextuel
    const handleAction = async (action: string) => {
        if (contextMenu.nodeKey && dataState) {
            const node = findNode(dataState, contextMenu.nodeKey);
            if (!node) {
                console.error("Noeud non trouvé pour l'action.");
                closeContextMenu();
                return;
            }
            if (action === "Ajouter Dossier") {
                try {
                    const newNodeData: NodeInUpdate = {
                        name: "Nouveau Dossier",
                        parent_id: node.id
                    };
                    const response = await NodeAPI.createNode(node.academic_year, newNodeData);
                    if (response.isError()) {
                        console.error("Erreur lors de la création du dossier:", response.errorMessage());
                        return;
                    }
                    const parent = findNode(dataState, contextMenu.nodeKey);
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
                try {
                    const newUEData: UEInCreation = {
                        "academic_year": academicYear,
                        "name": "Nouvelle UE",
                        "parent_id": node.id,
                        "courses": [
                            {
                                "academic_year": academicYear,
                                "duration": 1,
                                "group_count": 1,
                                "course_type_id": 1
                            },
                            {
                                "academic_year": academicYear,
                                "duration": 1,
                                "group_count": 1,
                                "course_type_id": 2
                            },
                            {
                                "academic_year": academicYear,
                                "duration": 1,
                                "group_count": 1,
                                "course_type_id": 3
                            },
                            {
                                "academic_year": academicYear,
                                "duration": 1,
                                "group_count": 1,
                                "course_type_id": 4
                            },
                            {
                                "academic_year": academicYear,
                                "duration": 1,
                                "group_count": 1,
                                "course_type_id": 5
                            }
                        ]
                    };

                    const ueResponse = await UEAPI.createUE(newUEData);
                    if (ueResponse.isError()) {
                        console.error("Erreur lors de la création de l'UE:", ueResponse.errorMessage());
                        return;
                    }
                    const updatedParent = await loadNodeChildren(node.id, node.academic_year);
                    if (updatedParent) {
                        const childrenNodes = await Promise.all(
                            (updatedParent.child_nodes || []).map(async (child: number | APINode) => {
                                if (typeof child === "number") {
                                    return await loadNodeChildren(child, updatedParent.academic_year);
                                } else if (typeof child === "object" && child !== null) {
                                    if ("courses" in child) {
                                        return { ...child, type: "ue" };
                                    }
                                    return child;
                                } else {
                                    return null;
                                }
                            })
                        );
                        updateNodeInTree(node.id, {
                            ...updatedParent,
                            children: childrenNodes.filter((child) => child !== null)
                        });
                    }
                } catch (error) {
                    console.error("Erreur lors de la création de l'UE:", error);
                }
            } else if (action === "Supprimer") {
                const nodeToDelete = findNode(dataState, contextMenu.nodeKey);
                if (!nodeToDelete) {
                    console.error("Noeud non trouvé pour la suppression.");
                    closeContextMenu();
                    return;
                }
                try {
                    if (nodeToDelete.type === "node") {
                        const response = await NodeAPI.deleteNode(nodeToDelete.academic_year, nodeToDelete.id);
                        if (response.isError()) {
                            console.error("Erreur lors de la suppression du dossier:", response.errorMessage());
                            return;
                        }
                    } else if (nodeToDelete.type === "ue") {
                        const response = await UEAPI.deleteUE(nodeToDelete.id);
                        if (response.isError()) {
                            console.error("Erreur lors de la suppression de l'UE:", response.errorMessage());
                            return;
                        }
                    }
                    if (getNodeKey(dataState) === contextMenu.nodeKey) {
                        setDataState(null);
                    } else {
                        const parentNode = findParentNode(dataState, contextMenu.nodeKey);
                        if (parentNode && parentNode.children) {
                            const index = parentNode.children.findIndex(
                                (child) => getNodeKey(child) === contextMenu.nodeKey
                            );
                            if (index > -1) {
                                parentNode.children.splice(index, 1);
                                setDataState({ ...dataState });
                            }
                        }
                    }
                } catch (error) {
                    console.error("Erreur lors de la suppression:", error);
                }
            } else if (action === "Renommer") {
                setEditingNodeId(contextMenu.nodeKey);
                setNewNodeName(node.name);
            }
            closeContextMenu();
        }
    };

    // Passage en mode édition lors d'un double-clic
    const handleDoubleClick = (nodeKey: string, name: string) => {
        setEditingNodeId(nodeKey);
        setNewNodeName(name);
    };

    // Mise à jour du nom en local lors de la saisie
    const handleNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNodeName(e.target.value);
    };

    // Soumission du nouveau nom et envoi vers le backend
    const handleNodeNameSubmit = async (nodeKey: string) => {
        if (!dataState) return;
        const node = findNode(dataState, nodeKey);
        if (node) {
            const trimmedName = newNodeName.trim() === "" ? "default" : newNodeName.trim();
            try {
                if (node.type === "node") {
                    const response = await NodeAPI.updateNode(node.academic_year, node.id, { name: trimmedName });
                    if (response.isError()) {
                        console.error("Erreur lors de la mise à jour du nom:", response.errorMessage());
                    } else {
                        node.name = trimmedName;
                        setDataState({ ...dataState });
                    }
                } else if (node.type === "ue") {
                    const response = await UEAPI.modifyUE(node.id, { name: trimmedName, academic_year: academicYear } as UeInUpdate);
                    if (response.isError()) {
                        console.error("Erreur lors de la mise à jour du nom de l'UE:", response.errorMessage());
                    } else {
                        node.name = trimmedName;
                        setDataState({ ...dataState });
                        
                    }
                }
            } catch (error) {
                console.error("Erreur lors de l'appel à l'API de mise à jour:", error);
            }
        }
        setEditingNodeId(null);
    };

    // Rendu d'un nœud (ou UE) et de ses éventuels enfants
    const renderNode = (node: TreeNode) => {
        const nodeKey = getNodeKey(node);
        const isOpen = openNodes.has(nodeKey);

        return (
            <div key={nodeKey} className="ml-4 relative">
                {isOpen && node.type === "node" && (
                    <div className="absolute left-[-5px] top-3 h-full w-[1px] bg-blue-300"></div>
                )}
                <div
                    className="flex items-center gap-2 cursor-pointer hover:text-gray-700"
                    onContextMenu={(e) => handleContextMenu(e, nodeKey)}
                >
                    {node.type === "node" ? (
                        <button className="text-lg font-bold" onClick={() => toggleNode(node)}>
                            {isOpen ? "∨" : ">"}
                        </button>
                    ) : (
                        <span className="w-6">📚</span> // Icône pour les UE
                    )}
                    {editingNodeId === nodeKey ? (
                        <input
                            type="text"
                            value={newNodeName}
                            onChange={handleNodeNameChange}
                            onBlur={() => handleNodeNameSubmit(nodeKey)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleNodeNameSubmit(nodeKey);
                                }
                            }}
                            className="text-lg font-semibold whitespace-nowrap"
                            autoFocus
                        />
                    ) : (
                        <span
                            className={`text-lg font-semibold whitespace-nowrap ${node.type === "ue" ? "text-blue-600" : ""}`}
                            onDoubleClick={() => handleDoubleClick(nodeKey, node.name)}
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
