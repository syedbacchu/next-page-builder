import type { BuilderNode } from "@/features/builder/types/builder.types";

export function moveNodeUp(
    node: BuilderNode,
    nodeId: string,
): BuilderNode {
    const children = [...node.children];

    const index = children.findIndex(
        (child) => child.id === nodeId,
    );

    if (index > 0) {
        [children[index - 1], children[index]] = [
            children[index],
            children[index - 1],
        ];

        return {
            ...node,
            children,
        };
    }

    return {
        ...node,
        children: children.map((child) =>
            moveNodeUp(child, nodeId),
        ),
    };
}


export function moveNodeDown(
    node: BuilderNode,
    nodeId: string,
): BuilderNode {
    const children = [...node.children];

    const index = children.findIndex(
        (child) => child.id === nodeId,
    );

    if (index !== -1 && index < children.length - 1) {
        [children[index], children[index + 1]] = [
            children[index + 1],
            children[index],
        ];

        return {
            ...node,
            children,
        };
    }

    return {
        ...node,
        children: children.map((child) =>
            moveNodeDown(child, nodeId),
        ),
    };
}