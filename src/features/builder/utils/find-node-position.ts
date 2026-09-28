import type { BuilderNode } from "@/features/builder/types/builder.types";

export interface NodePosition {
    parentId: string;
    index: number;
}

export function findNodePosition(
    node: BuilderNode,
    nodeId: string,
): NodePosition | null {
    const index = node.children.findIndex(
        (child) => child.id === nodeId,
    );

    if (index !== -1) {
        return {
            parentId: node.id,
            index,
        };
    }

    for (const child of node.children) {
        const result = findNodePosition(child, nodeId);

        if (result) {
            return result;
        }
    }

    return null;
}