export interface TreeNode {
    // Define las propiedades necesarias para TreeNode
    name: string;
    id: string;
    value: string;
    children?: TreeNode[];
}