import type { BuilderNode } from "@/features/builder/types/builder.types";

export function findNodeById(
    node: BuilderNode,
    nodeId: string,
): BuilderNode | null {
    if (node.id === nodeId) {
        return node;
    }

    for (const child of node.children) {
        const found = findNodeById(child, nodeId);

        if (found) {
            return found;
        }
    }

    return null;
}