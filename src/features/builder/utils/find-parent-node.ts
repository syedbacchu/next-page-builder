import type { BuilderNode } from "@/features/builder/types/builder.types";

export function findParentNode(
    current: BuilderNode,
    targetNodeId: string,
): BuilderNode | null {
    for (const child of current.children) {
        if (child.id === targetNodeId) {
            return current;
        }

        const parent = findParentNode(
            child,
            targetNodeId,
        );

        if (parent) {
            return parent;
        }
    }

    return null;
}