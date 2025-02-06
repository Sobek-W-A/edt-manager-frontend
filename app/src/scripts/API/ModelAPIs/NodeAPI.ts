import { api } from "../API.ts";
import { APINode, NodeInUpdate } from "../APITypes/Tree.ts";
import { HTTPMethod } from "../Enums/HTTPMethod.ts";
import APIResponse from "../Responses/APIResponse.ts";

export default class NodeAPI {
    static NODE_PATH = "/node";

    /**
     * Cette méthode récupère un noeud par son ID, incluant ses sous-noeuds
     * @param nodeId L'ID du noeud à récupérer
     * @returns Une promesse contenant le noeud ou une erreur
     */
    static async getNodeById(nodeId: number): Promise<APIResponse<APINode>> {
        const response = await api.requestLogged<APINode>(
            HTTPMethod.GET,
            `${NodeAPI.NODE_PATH}/id/${nodeId}`,
            undefined,
            undefined
        );
        console.log('Réponse du backend pour getNodeById:', response);
        return response;
    }

    /**
     * Cette méthode récupère le noeud racine d'une année académique donnée
     * @param academicYear L'année académique
     * @returns Une promesse contenant le noeud racine ou une erreur
     */
    static async getRootNode(academicYear: number): Promise<APIResponse<APINode>> {
        return api.requestLogged<APINode>(
            HTTPMethod.GET,
            `${NodeAPI.NODE_PATH}/root/${academicYear}`,
            undefined,
            undefined
        );
    }

    /**
     * Cette méthode récupère l'arborescence complète à partir du noeud racine
     * @param academicYear L'année académique
     * @returns Une promesse contenant l'arborescence complète ou une erreur
     */
    static async getRootArborescence(academicYear: number): Promise<APIResponse<APINode>> {
        return api.requestLogged<APINode>(
            HTTPMethod.GET,
            `${NodeAPI.NODE_PATH}/root/arborescence/${academicYear}`,
            undefined,
            undefined
        );
    }

    /**
     * Cette méthode récupère l'arborescence à partir d'un noeud spécifique
     * @param nodeId L'ID du noeud de départ
     * @param academicYear L'année académique
     * @returns Une promesse contenant l'arborescence ou une erreur
     */
    static async getNodeArborescence(nodeId: number, academicYear: number): Promise<APIResponse<APINode>> {
        return api.requestLogged<APINode>(
            HTTPMethod.GET,
            `${NodeAPI.NODE_PATH}/${nodeId}/arborescence/${academicYear}`,
            undefined,
            undefined
        );
    }

    /**
     * Cette méthode crée un nouveau nœud pour une année académique donnée
     * @param academicYear L'année académique
     * @param node Les données du nœud à créer
     * @returns Une promesse contenant le nœud créé ou une erreur
     */
    static async createNode(academicYear: number, node: NodeInUpdate): Promise<APIResponse<APINode>> {
        return api.requestLogged<APINode>(
            HTTPMethod.POST,
            `${NodeAPI.NODE_PATH}/${academicYear}`,
            JSON.stringify(node),
            undefined
        );
    }

    /**
     * Cette méthode modifie un nœud existant
     * @param academicYear L'année académique
     * @param nodeId L'ID du nœud à modifier
     * @param node Les nouvelles données du nœud
     * @returns Une promesse contenant une confirmation ou une erreur
     */
    static async updateNode(academicYear: number, nodeId: number, node: NodeInUpdate): Promise<APIResponse<undefined>> {
        return api.requestLogged<undefined>(
            HTTPMethod.PATCH,
            `${NodeAPI.NODE_PATH}/${academicYear}/${nodeId}`,
            JSON.stringify(node),
            undefined
        );
    }

    /**
     * Cette méthode supprime un nœud existant
     * @param academicYear L'année académique
     * @param nodeId L'ID du nœud à supprimer
     * @returns Une promesse contenant une confirmation ou une erreur
     */
    static async deleteNode(academicYear: number, nodeId: number): Promise<APIResponse<undefined>> {
        return api.requestLogged<undefined>(
            HTTPMethod.DELETE,
            `${NodeAPI.NODE_PATH}/${academicYear}/${nodeId}`,
            undefined,
            undefined
        );
    }
} 