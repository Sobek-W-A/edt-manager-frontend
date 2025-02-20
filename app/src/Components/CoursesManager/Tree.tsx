import React, { useState, useEffect } from "react";
import NodeAPI from "../../scripts/API/ModelAPIs/NodeAPI";
import UEAPI from "../../scripts/API/ModelAPIs/UEAPI";
import { APINode } from "../../scripts/API/APITypes/Tree";
import { NodeInUpdate } from "../../scripts/API/APITypes/Tree";
import { UEInCreation, UeInUpdate } from "../../scripts/API/APITypes/UE.ts";

type TreeNode = {
    academic_year: number;
    id: number;
    name: string;
    type: "node" | "ue";
    child_nodes: number[] | any[];
    children?: TreeNode[];
};

type TreeProps = {
    onSelectCourse: (course: TreeNode) => void;
    // 
};

const getNodeKey = (node: TreeNode) => `${node.type}-${node.id}`;

const refreshOpenNodes = async (
    node: TreeNode,
    openNodesSet: Set<string>,
    loadNodeChildren: (nodeId: number, academicYear: number) => Promise<any>
): Promise<TreeNode> => {
    let updatedNode = node;
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

    // Popup d'erreur
    const [errorPopup, setErrorPopup] = useState<string | null>(null);
    // Popup pour la création d'une UE
    const [showAddUEPopup, setShowAddUEPopup] = useState(false);
    const [newUEName, setNewUEName] = useState("");
    // Nouveaux états pour les paramètres de chaque cours (5 lignes : CM, TD, TP, EI, TPL)
    const [newUECourses, setNewUECourses] = useState<
        { duration: number; group_count: number }[]
    >([
        { duration: 1, group_count: 1 },
        { duration: 1, group_count: 1 },
        { duration: 1, group_count: 1 },
        { duration: 1, group_count: 1 },
        { duration: 1, group_count: 1 }
    ]);
    const [parentForNewUE, setParentForNewUE] = useState<TreeNode | null>(null);

    const [academicYear, setAcademicYear] = useState<string>(
        window.sessionStorage.getItem("academic_year") || "2024"
    );

    const showError = (msg: string) => {
        setErrorPopup(msg);
        console.error(msg);
    };

    useEffect(() => {
        if (errorPopup) {
            const timer = setTimeout(() => setErrorPopup(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [errorPopup]);

    const chargementDonneeBackend = async () => {
        try {
            const response = await NodeAPI.getRootNode();
            if (response.isError()) {
                showError("Erreur lors du chargement du node racine: " + response.errorMessage());
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
            showError("Erreur lors de l'appel à l'API: " + error);
        }
    };

    useEffect(() => {
        chargementDonneeBackend();
    }, [academicYear]);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedYear = window.sessionStorage.getItem("academic_year");
            if (storedYear && storedYear !== academicYear) {
                setAcademicYear(storedYear);
                console.log("Storage event:", storedYear);
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [academicYear]);

    useEffect(() => {
        const handleSessionStorageChange = () => {
            const storedYear = window.sessionStorage.getItem("academic_year");
            setAcademicYear((prev) => (storedYear && storedYear !== prev ? storedYear : prev));
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

    const loadNodeChildren = async (nodeId: number, academicYear: number) => {
        try {
            const response = await NodeAPI.getNodeById(nodeId);
            if (response.isError()) {
                showError(`Erreur lors du chargement du node ${nodeId}: ${response.errorMessage()}`);
                return null;
            }
            return response.responseObject();
        } catch (error) {
            showError("Erreur lors de l'appel à l'API: " + error);
            return null;
        }
    };

    const toggleNode = async (node: TreeNode) => {
        const nodeKey = getNodeKey(node);
        const newSet = new Set(openNodes);
        if (newSet.has(nodeKey)) {
            newSet.delete(nodeKey);
            setOpenNodes(newSet);
        } else {
            newSet.add(nodeKey);
            setOpenNodes(newSet);
            const refreshed = await refreshOpenNodes(node, newSet, loadNodeChildren);
            updateNodeInTree(node.id, refreshed);
        }
    };

    const updateNodeInTree = (nodeId: number, updatedNode: TreeNode) => {
        if (!dataState) return;
        const updateNode = (node: TreeNode): TreeNode => {
            if (node.id === nodeId && node.type === updatedNode.type) return updatedNode;
            if (node.children) {
                return { ...node, children: node.children.map((child) => updateNode(child)) };
            }
            return node;
        };
        setDataState(updateNode(dataState));
    };

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

    const handleAction = async (action: string) => {
        if (contextMenu.nodeKey && dataState) {
            const node = findNode(dataState, contextMenu.nodeKey);
            if (!node) {
                showError("Noeud non trouvé pour l'action.");
                closeContextMenu();
                return;
            }
            if (action === "Ajouter Dossier") {
                try {
                    const newNodeData: NodeInUpdate = { name: "Nouveau Dossier", parent_id: node.id };
                    const response = await NodeAPI.createNode(node.academic_year, newNodeData);
                    if (response.isError()) {
                        showError("Erreur lors de la création du dossier: " + response.errorMessage());
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
                        parent.children = parent.children ? [...parent.children, newFolder] : [newFolder];
                        setDataState({ ...dataState });
                    }
                } catch (error) {
                    showError("Erreur lors de la création du dossier: " + error);
                }
            } else if (action === "Ajouter UE") {
                // Ouvre le popup pour créer une UE
                setParentForNewUE(node);
                setNewUEName("");
                // Réinitialise les valeurs pour chaque ligne de cours
                setNewUECourses([
                    { duration: 1, group_count: 1 },
                    { duration: 1, group_count: 1 },
                    { duration: 1, group_count: 1 },
                    { duration: 1, group_count: 1 },
                    { duration: 1, group_count: 1 }
                ]);
                setShowAddUEPopup(true);
                closeContextMenu();
                return;
            } else if (action === "Supprimer") {
                const nodeToDelete = findNode(dataState, contextMenu.nodeKey);
                if (!nodeToDelete) {
                    showError("Noeud non trouvé pour la suppression.");
                    closeContextMenu();
                    return;
                }
                try {
                    if (nodeToDelete.type === "node") {
                        const response = await NodeAPI.deleteNode(nodeToDelete.academic_year, nodeToDelete.id);
                        if (response.isError()) {
                            showError("Erreur lors de la suppression du dossier: " + response.errorMessage());
                            return;
                        }
                    } else if (nodeToDelete.type === "ue") {
                        const response = await UEAPI.deleteUE(nodeToDelete.id);
                        if (response.isError()) {
                            showError("Erreur lors de la suppression de l'UE: " + response.errorMessage());
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
                    showError("Erreur lors de la suppression: " + error);
                }
            } else if (action === "Renommer") {
                setEditingNodeId(contextMenu.nodeKey);
                setNewNodeName(node.name);
            }
            closeContextMenu();
        }
    };

    const handleCreateUE = async () => {
        if (!parentForNewUE) return;
        const newUEData: UEInCreation = {
            academic_year: academicYear,
            name: newUEName || "Nouvelle UE",
            parent_id: parentForNewUE.id,
            courses: newUECourses.map((course, index) => ({
                academic_year: academicYear,
                duration: course.duration,
                group_count: course.group_count,
                course_type_id: index + 1
            }))
        };

        const ueResponse = await UEAPI.createUE(newUEData);
        if (ueResponse.isError()) {
            showError("Erreur lors de la création de l'UE: " + ueResponse.errorMessage());
            return;
        }
        const updatedParent = await loadNodeChildren(parentForNewUE.id, parentForNewUE.academic_year);
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
            updateNodeInTree(parentForNewUE.id, {
                ...updatedParent,
                children: childrenNodes.filter((child) => child !== null)
            });
        }
        setShowAddUEPopup(false);
    };

    const handleDoubleClick = (nodeKey: string, name: string) => {
        setEditingNodeId(nodeKey);
        setNewNodeName(name);
    };

    const handleNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNodeName(e.target.value);
    };

    const handleNodeNameSubmit = async (nodeKey: string) => {
        if (!dataState) return;
        const node = findNode(dataState, nodeKey);
        if (node) {
            const trimmedName = newNodeName.trim() === "" ? "default" : newNodeName.trim();
            try {
                if (node.type === "node") {
                    const response = await NodeAPI.updateNode(node.academic_year, node.id, { name: trimmedName });
                    if (response.isError()) {
                        showError("Erreur lors de la mise à jour du nom: " + response.errorMessage());
                    } else {
                        node.name = trimmedName;
                        setDataState({ ...dataState });
                    }
                } else if (node.type === "ue") {
                    const response = await UEAPI.modifyUE(node.id, { name: trimmedName, academic_year: academicYear } as UeInUpdate);
                    if (response.isError()) {
                        showError("Erreur lors de la mise à jour du nom de l'UE: " + response.errorMessage());
                    } else {
                        node.name = trimmedName;
                        setDataState({ ...dataState });
                    }
                }
            } catch (error) {
                showError("Erreur lors de l'appel à l'API de mise à jour: " + error);
            }
        }
        setEditingNodeId(null);
    };

    const renderNode = (node: TreeNode) => {
        const nodeKey = getNodeKey(node);
        const isOpen = openNodes.has(nodeKey);
        return (
            <div key={nodeKey} className="ml-4 relative">
                {isOpen && node.type === "node" && (
                    <div className="absolute left-[-5px] top-3 h-full w-[1px] bg-blue-300"></div>
                )}
                <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700" onContextMenu={(e) => handleContextMenu(e, nodeKey)}>
                    {node.type === "node" ? (
                        <button className="text-lg font-bold" onClick={() => toggleNode(node)}>
                            {isOpen ? "∨" : ">"}
                        </button>
                    ) : (
                        <span className="w-6">📚</span>
                    )}
                    {editingNodeId === nodeKey ? (
                        <input
                            type="text"
                            value={newNodeName}
                            onChange={handleNodeNameChange}
                            onBlur={() => handleNodeNameSubmit(nodeKey)}
                            onKeyDown={(e) => e.key === "Enter" && handleNodeNameSubmit(nodeKey)}
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
            {errorPopup && (
                <div className="fixed top-4 right-4 z-50 bg-red-500 text-white p-2 rounded shadow">
                    {errorPopup}
                </div>
            )}
            <div className="flex-grow h-full">{dataState && renderNode(dataState)}</div>
            {contextMenu.visible && (
                <div className="absolute bg-white border border-gray-300 rounded shadow-md" style={{ top: contextMenu.y, left: contextMenu.x }}>
                    <button className="block px-4 py-2 text-left hover:bg-gray-100 w-full" onClick={() => handleAction("Renommer")}>
                        Renommer
                    </button>
                    <button className="block px-4 py-2 text-left hover:bg-gray-100 w-full" onClick={() => handleAction("Ajouter Dossier")}>
                        Ajouter Dossier
                    </button>
                    <button className="block px-4 py-2 text-left hover:bg-gray-100 w-full" onClick={() => handleAction("Ajouter UE")}>
                        Ajouter UE
                    </button>
                    <button className="block px-4 py-2 text-left hover:bg-gray-100 w-full" onClick={() => handleAction("Supprimer")}>
                        Supprimer
                    </button>
                </div>
            )}
            {showAddUEPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Créer une nouvelle UE</h3>
                        <label className="block mb-2">
                            Nom de l'UE:
                            <input
                                type="text"
                                value={newUEName}
                                onChange={(e) => setNewUEName(e.target.value)}
                                className="border p-1 w-full mt-1"
                            />
                        </label>
                        {/* Formulaire pour chaque ligne */}
                        {["CM", "TD", "TP", "EI", "TPL"].map((label, index) => (
                            <div key={index} className="mb-2">
                                <strong>{label}</strong>
                                <div className="flex gap-2 mt-1">
                                    <input
                                        type="number"
                                        placeholder="Durée"
                                        value={newUECourses[index].duration}
                                        onChange={(e) => {
                                            const newCourses = [...newUECourses];
                                            newCourses[index].duration = parseInt(e.target.value) || 0;
                                            setNewUECourses(newCourses);
                                        }}
                                        className="border p-1 w-1/2"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Nb Groupes"
                                        value={newUECourses[index].group_count}
                                        onChange={(e) => {
                                            const newCourses = [...newUECourses];
                                            newCourses[index].group_count = parseInt(e.target.value) || 0;
                                            setNewUECourses(newCourses);
                                        }}
                                        className="border p-1 w-1/2"
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end gap-2 mt-4">
                            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setShowAddUEPopup(false)}>
                                Annuler
                            </button>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={handleCreateUE}>
                                Créer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tree;
