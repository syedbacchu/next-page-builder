import type {
    BuilderDocument,
    BuilderNode,
} from "@/features/builder/types/builder.types";
import type { DropPosition } from "@/features/builder/types/drop-position.types";
import {findNodeById} from "@/features/builder/utils/find-node";
import { componentRegistry } from "@/features/builder/registry/component-registry";
import { canDropNode } from "@/features/builder/utils/can-drop-node";

function removeNode(
    node: BuilderNode,
    nodeId: string,
): {
    node: BuilderNode;
    removedNode: BuilderNode | null;
} {
    const childIndex = node.children.findIndex(
        (child) => child.id === nodeId,
    );

    if (childIndex !== -1) {
        const children = [...node.children];
        const [removedNode] = children.splice(childIndex, 1);

        return {
            node: {
                ...node,
                children,
            },
            removedNode,
        };
    }

    let removedNode: BuilderNode | null = null;

    const children = node.children.map((child) => {
        if (removedNode) return child;

        const result = removeNode(child, nodeId);

        if (result.removedNode) {
            removedNode = result.removedNode;
        }

        return result.node;
    });

    return {
        node: {
            ...node,
            children,
        },
        removedNode,
    };
}

function containsNode(
    node: BuilderNode,
    nodeId: string,
): boolean {
    if (node.id === nodeId) {
        return true;
    }

    return node.children.some((child) =>
        containsNode(child, nodeId),
    );
}
function insertNode(
    node: BuilderNode,
    newNode: BuilderNode,
    position: DropPosition,
): BuilderNode {
    if (position.type === "inside") {
        if (node.id === position.targetNodeId) {
            return {
                ...node,
                children: [...node.children, newNode],
            };
        }
    }

    const targetIndex = node.children.findIndex(
        (child) => child.id === position.targetNodeId,
    );

    if (targetIndex !== -1) {
        const children = [...node.children];

        const insertIndex =
            position.type === "before"
                ? targetIndex
                : targetIndex + 1;

        children.splice(insertIndex, 0, newNode);

        return {
            ...node,
            children,
        };
    }

    return {
        ...node,
        children: node.children.map((child) =>
            insertNode(child, newNode, position),
        ),
    };
}

export function moveNodeToPosition(
    document: BuilderDocument,
    nodeId: string,
    position: DropPosition,
): BuilderDocument {
    if (nodeId === document.id) {
        return document;
    }

    const sourceNode = findNodeById(document, nodeId);

    if (!sourceNode) {
        return document;
    }

    if (!canDropNode(document, nodeId, position)) {
        return document;
    }

    const {
        node: documentWithoutNode,
        removedNode,
    } = removeNode(document, nodeId);

    if (!removedNode) {
        return document;
    }

    return insertNode(
        documentWithoutNode,
        removedNode,
        position,
    ) as BuilderDocument;
}