import type { BuilderNode } from "@/features/builder/types/builder.types";

export function addNodeToParent(
    node: BuilderNode,
    parentId: string,
    newNode: BuilderNode,
): BuilderNode {
    if (node.id === parentId) {
        return {
            ...node,
            children: [...node.children, newNode],
        };
    }

    return {
        ...node,
        children: node.children.map((child) =>
            addNodeToParent(child, parentId, newNode),
        ),
    };
}