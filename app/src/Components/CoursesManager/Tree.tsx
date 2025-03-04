import React, { useState, useEffect } from "react";
import NodeAPI from "../../scripts/API/ModelAPIs/NodeAPI";
import UEAPI from "../../scripts/API/ModelAPIs/UEAPI";
import { APINode } from "../../scripts/API/APITypes/Tree";
import { NodeInUpdate } from "../../scripts/API/APITypes/Tree";
import { UEInCreation, UeInUpdate } from "../../scripts/API/APITypes/UE.ts";

export type TreeNode = {
    academic_year: number;
    id: number;
    name: string;
    type: "node" | "ue";
    child_nodes: number[] | any[];
    children?: TreeNode[];
};

type TreeProps = {
    onSelectCourse: (course: TreeNode) => void;
};

// getNodeKey reste utilisé pour l'affichage ou d'autres traitements
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
    // Le menu contextuel stocke désormais le nœud cliqué et son parent
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        node: TreeNode | null;
        parent: TreeNode | null;
    }>({ visible: false, x: 0, y: 0, node: null, parent: null });
    const [dataState, setDataState] = useState<TreeNode | null>(null);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [newNodeName, setNewNodeName] = useState<string>("");

    // Popup d'erreur
    const [errorPopup, setErrorPopup] = useState<string | null>(null);
    // Popup pour la création d'une UE
    const [showAddUEPopup, setShowAddUEPopup] = useState(false);
    const [newUEName, setNewUEName] = useState("");
    // Paramètres de chaque cours (CM, TD, TP, EI, TPL)
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
    // Pour saisir l'ID d'une UE existante
    const [existingUEId, setExistingUEId] = useState<string>("");

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

    const toggleNode = async (node: TreeNode, parent: TreeNode | null) => {
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

    // On passe directement le nœud cliqué et son parent au menu contextuel
    const handleContextMenu = (
        e: React.MouseEvent,
        node: TreeNode,
        parent: TreeNode | null
    ) => {
        e.preventDefault();
        e.stopPropagation();
        const x = e.clientX;
        const y = e.clientY - 40;
        setContextMenu({ visible: true, x, y, node, parent });
    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0, node: null, parent: null });
    };

    const handleAction = async (action: string) => {
        if (!contextMenu.node) {
            showError("Noeud non trouvé pour l'action.");
            closeContextMenu();
            return;
        }
        const node = contextMenu.node;
        switch (action) {
            case "Ajouter Dossier": {
                try {
                    const newNodeData: NodeInUpdate = { name: "Nouveau Dossier", parent_id: node.id };
                    const response = await NodeAPI.createNode(newNodeData);
                    if (response.isError()) {
                        showError("Erreur lors de la création du dossier: " + response.errorMessage());
                        return;
                    }
                    const newFolderId = response.responseObject()?.id || Date.now();
                    const newFolder: TreeNode = {
                        academic_year: node.academic_year,
                        id: newFolderId,
                        name: "Nouveau Dossier",
                        type: "node",
                        child_nodes: [],
                        children: []
                    };
                    node.children = node.children ? [...node.children, newFolder] : [newFolder];
                    setDataState({ ...dataState! });
                } catch (error) {
                    showError("Erreur lors de la création du dossier: " + error);
                }
                break;
            }
            case "Ajouter UE": {
                setParentForNewUE(node);
                setNewUEName("");
                setExistingUEId("");
                setNewUECourses([
                    { duration: 1, group_count: 1 },
                    { duration: 1, group_count: 1 },
                    { duration: 1, group_count: 1 },
                    { duration: 1, group_count: 1 },
                    { duration: 1, group_count: 1 }
                ]);
                setShowAddUEPopup(true);
                break;
            }
            case "Détacher UE": {
                if (node.type !== "ue") {
                    showError("L'action de détachement ne s'applique qu'à une UE.");
                    closeContextMenu();
                    return;
                }
                if (!contextMenu.parent) {
                    showError("Parent non trouvé pour détacher l'UE.");
                    closeContextMenu();
                    return;
                }
                const detachResponse = await UEAPI.detachUEFromNode(node.id, contextMenu.parent.id);
                if (detachResponse.isError()) {
                    showError("Erreur lors du détachement de l'UE: " + detachResponse.errorMessage());
                    closeContextMenu();
                    return;
                }
                if (contextMenu.parent.children) {
                    const index = contextMenu.parent.children.findIndex((child) => child === node);
                    if (index > -1) {
                        contextMenu.parent.children.splice(index, 1);
                        setDataState({ ...dataState! });
                    }
                }
                break;
            }
            case "Supprimer": {
                try {
                    if (node.type === "node") {
                        const response = await NodeAPI.deleteNode(node.id);
                        if (response.isError()) {
                            showError("Erreur lors de la suppression du dossier: " + response.errorMessage());
                            return;
                        }
                    } else if (node.type === "ue") {
                        const response = await UEAPI.deleteUE(node.id);
                        if (response.isError()) {
                            showError("Erreur lors de la suppression de l'UE: " + response.errorMessage());
                            return;
                        }
                    }
                    if (!contextMenu.parent) {
                        setDataState(null);
                    } else if (contextMenu.parent.children) {
                        const index = contextMenu.parent.children.findIndex((child) => child === node);
                        if (index > -1) {
                            contextMenu.parent.children.splice(index, 1);
                            setDataState({ ...dataState! });
                        }
                    }
                } catch (error) {
                    showError("Erreur lors de la suppression: " + error);
                }
                break;
            }
            case "Renommer": {
                setEditingNodeId(getNodeKey(node));
                setNewNodeName(node.name);
                break;
            }
            default:
                break;
        }
        closeContextMenu();
    };

    const handleCreateUE = async () => {
        if (!parentForNewUE) return;
        if (existingUEId.trim() !== "") {
            const ueId = parseInt(existingUEId);
            if (isNaN(ueId)) {
                showError("ID d'UE existante invalide.");
                return;
            }
            const attachResponse = await UEAPI.attachUEToNode(ueId, parentForNewUE.id);
            if (attachResponse.isError()) {
                showError("Erreur lors de l'attachement de l'UE: " + attachResponse.errorMessage());
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
        } else {
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
        }
        setShowAddUEPopup(false);
        setExistingUEId("");
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
        const updateInTree = (node: TreeNode): TreeNode => {
            if (getNodeKey(node) === nodeKey) {
                return { ...node, name: newNodeName.trim() === "" ? "default" : newNodeName.trim() };
            }
            if (node.children) {
                return { ...node, children: node.children.map(updateInTree) };
            }
            return node;
        };
        setDataState(updateInTree(dataState));
        try {
            if (dataState) {
                if (nodeKey.startsWith("node-")) {
                    const response = await NodeAPI.updateNode(parseInt(nodeKey.split("-")[1]), { name: newNodeName });
                    if (response.isError()) {
                        showError("Erreur lors de la mise à jour du nom: " + response.errorMessage());
                    }
                } else if (nodeKey.startsWith("ue-")) {
                    const response = await UEAPI.modifyUE(parseInt(nodeKey.split("-")[1]), { name: newNodeName, academic_year: academicYear } as UeInUpdate);
                    if (response.isError()) {
                        showError("Erreur lors de la mise à jour du nom de l'UE: " + response.errorMessage());
                    }
                }
            }
        } catch (error) {
            showError("Erreur lors de l'appel à l'API de mise à jour: " + error);
        }
        setEditingNodeId(null);
    };

    // Modification de renderNode pour transmettre le parent (null pour la racine)
    const renderNode = (node: TreeNode, parent: TreeNode | null = null) => {
        const nodeKey = getNodeKey(node);
        const isOpen = openNodes.has(nodeKey);
        return (
            <div key={nodeKey} className="ml-4 relative">
                {isOpen && node.type === "node" && (
                    <div className="absolute left-[-5px] top-3 h-full w-[1px] bg-blue-300"></div>
                )}
                <div
                    className="flex items-center gap-2 cursor-pointer hover:text-gray-700"
                    onContextMenu={(e) => handleContextMenu(e, node, parent)}
                >
                    {node.type === "node" ? (
                        <button className="text-lg font-bold" onClick={() => toggleNode(node, parent)}>
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
                        {node.children.map((child) => renderNode(child, node))}
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
                    {contextMenu.node && contextMenu.node.type === "node" && (
                        <>
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
                        </>
                    )}
                    {contextMenu.node && contextMenu.node.type === "ue" && (
                        <button
                            className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                            onClick={() => handleAction("Détacher UE")}
                        >
                            Détacher UE
                        </button>
                    )}
                    <button
                        className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                        onClick={() => handleAction("Supprimer")}
                    >
                        Supprimer
                    </button>
                </div>
            )}
            {showAddUEPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Créer une nouvelle UE</h3>
                        {/* Champ pour saisir l'ID d'une UE existante */}
                        <label className="block mb-2">
                            ID d'une UE existante:
                            <input
                                type="number"
                                value={existingUEId}
                                onChange={(e) => setExistingUEId(e.target.value)}
                                className="border p-1 w-full mt-1"
                            />
                        </label>
                        <p className="text-sm text-gray-500 mb-2">
                            Si vous saisissez un ID, les autres champs seront désactivés.
                        </p>
                        <label className="block mb-2">
                            Nom de l'UE:
                            <input
                                type="text"
                                value={newUEName}
                                onChange={(e) => setNewUEName(e.target.value)}
                                className="border p-1 w-full mt-1"
                                disabled={existingUEId.trim() !== ""}
                            />
                        </label>
                        {/* Formulaire pour chaque ligne de cours */}
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
                                        disabled={existingUEId.trim() !== ""}
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
                                        disabled={existingUEId.trim() !== ""}
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
