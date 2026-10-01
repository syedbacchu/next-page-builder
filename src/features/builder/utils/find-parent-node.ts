import type { BuilderNode } from "@/features/builder/types/builder.types";

export function findParentNode(
    node: BuilderNode,
    childId: string,
): BuilderNode | null {
    for (const child of node.children) {
        if (child.id === childId) {
            return node;
        }

        const parent = findParentNode(child, childId);

        if (parent) {
            return parent;
        }
    }

    return null;
}