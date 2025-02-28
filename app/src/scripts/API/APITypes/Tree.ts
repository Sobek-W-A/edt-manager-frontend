export type APINode = {
    academic_year: number;
    id: number;
    name: string;
    type: "node" | "ue";
    child_nodes: (number | APINode)[];
};

export type NodeInUpdate = {
    name: string;
    parent_id: number;
}; 