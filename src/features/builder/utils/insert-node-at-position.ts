import type { BuilderNode } from "@/features/builder/types/builder.types";

export function insertNodeAtPosition(
    node: BuilderNode,
    parentId: string,
    newNode: BuilderNode,
    index: number,
): BuilderNode {
    if (node.id === parentId) {
        const children = [...node.children];

        const safeIndex = Math.max(
            0,
            Math.min(index, children.length),
        );

        children.splice(safeIndex, 0, newNode);

        return {
            ...node,
            children,
        };
    }

    return {
        ...node,
        children: node.children.map((child) =>
            insertNodeAtPosition(
                child,
                parentId,
                newNode,
                index,
            ),
        ),
    };
}