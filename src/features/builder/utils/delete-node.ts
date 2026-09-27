import type { BuilderNode } from "@/features/builder/types/builder.types";

export function deleteNode(
    node: BuilderNode,
    nodeId: string,
): BuilderNode {
    return {
        ...node,
        children: node.children
            .filter((child) => child.id !== nodeId)
            .map((child) => deleteNode(child, nodeId)),
    };
}