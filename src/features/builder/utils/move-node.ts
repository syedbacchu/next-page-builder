import type { BuilderNode } from "@/features/builder/types/builder.types";

export function moveNodeUp(
    node: BuilderNode,
    nodeId: string,
): BuilderNode {
    const index = node.children.findIndex(
        (child) => child.id === nodeId,
    );

    // Node is a direct child and can move up.
    if (index > 0) {
        const children = [...node.children];

        [children[index - 1], children[index]] = [
            children[index],
            children[index - 1],
        ];

        return {
            ...node,
            children,
        };
    }

    // Try to find the node deeper in the tree.
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        const updatedChild = moveNodeUp(
            child,
            nodeId,
        );

        if (updatedChild !== child) {
            const children = [...node.children];
            children[i] = updatedChild;

            return {
                ...node,
                children,
            };
        }
    }

    // Nothing changed.
    return node;
}

export function moveNodeDown(
    node: BuilderNode,
    nodeId: string,
): BuilderNode {
    const index = node.children.findIndex(
        (child) => child.id === nodeId,
    );

    // Node is a direct child and can move down.
    if (
        index !== -1 &&
        index < node.children.length - 1
    ) {
        const children = [...node.children];

        [children[index], children[index + 1]] = [
            children[index + 1],
            children[index],
        ];

        return {
            ...node,
            children,
        };
    }

    // Try to find the node deeper in the tree.
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        const updatedChild = moveNodeDown(
            child,
            nodeId,
        );

        if (updatedChild !== child) {
            const children = [...node.children];
            children[i] = updatedChild;

            return {
                ...node,
                children,
            };
        }
    }

    // Nothing changed.
    return node;
}