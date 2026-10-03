import type {
    BuilderDocument,
    BuilderNode,
} from "@/features/builder/types/builder.types";
import type { DropPosition } from "@/features/builder/types/drop-position.types";
import { findNodeById } from "@/features/builder/utils/find-node";
import { canDropNode } from "@/features/builder/utils/can-drop-node";

function removeNode(
    node: BuilderNode,
    nodeId: string,
): {
    node: BuilderNode;
    removedNode: BuilderNode | null;
} {
    const childIndex =
        node.children.findIndex(
            (child) => child.id === nodeId,
        );

    if (childIndex !== -1) {
        const children = [...node.children];

        const [removedNode] =
            children.splice(
                childIndex,
                1,
            );

        return {
            node: {
                ...node,
                children,
            },
            removedNode,
        };
    }

    let removedNode:
        | BuilderNode
        | null = null;

    const children = node.children.map(
        (child) => {
            if (removedNode) {
                return child;
            }

            const result =
                removeNode(
                    child,
                    nodeId,
                );

            if (result.removedNode) {
                removedNode =
                    result.removedNode;
            }

            return result.node;
        },
    );

    return {
        node: {
            ...node,
            children,
        },
        removedNode,
    };
}

function insertNode(
    node: BuilderNode,
    newNode: BuilderNode,
    position: DropPosition,
): BuilderNode {
    if (
        position.type === "inside" &&
        node.id === position.targetNodeId
    ) {
        return {
            ...node,
            children: [
                ...node.children,
                newNode,
            ],
        };
    }

    const targetIndex =
        node.children.findIndex(
            (child) =>
                child.id ===
                position.targetNodeId,
        );

    if (targetIndex !== -1) {
        const children = [...node.children];

        const insertIndex =
            position.type === "before"
                ? targetIndex
                : targetIndex + 1;

        children.splice(
            insertIndex,
            0,
            newNode,
        );

        return {
            ...node,
            children,
        };
    }

    let changed = false;

    const children = node.children.map(
        (child) => {
            if (changed) {
                return child;
            }

            const updated =
                insertNode(
                    child,
                    newNode,
                    position,
                );

            if (updated !== child) {
                changed = true;
            }

            return updated;
        },
    );

    if (!changed) {
        return node;
    }

    return {
        ...node,
        children,
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

    if (
        position.targetNodeId === nodeId
    ) {
        return document;
    }

    const sourceNode =
        findNodeById(
            document,
            nodeId,
        );

    if (!sourceNode) {
        return document;
    }

    if (
        !canDropNode(
            document,
            nodeId,
            position,
        )
    ) {
        return document;
    }

    /*
     * Remove source node.
     */
    const {
        node: documentWithoutNodeData,
        removedNode,
    } = removeNode(
        document,
        nodeId,
    );

    if (!removedNode) {
        return document;
    }

    /*
     * Re-create the root as BuilderDocument.
     *
     * removeNode works with BuilderNode recursively,
     * while the root must remain type "page".
     */
    const documentWithoutNode: BuilderDocument = {
        id: documentWithoutNodeData.id,
        type: "page",
        props: documentWithoutNodeData.props,
        styles: documentWithoutNodeData.styles,
        children: documentWithoutNodeData.children,
    };

    /*
     * Root-level before / after.
     */
    if (
        position.type !== "inside"
    ) {
        const targetIndex =
            documentWithoutNode.children.findIndex(
                (child) =>
                    child.id ===
                    position.targetNodeId,
            );

        if (targetIndex !== -1) {
            const children = [
                ...documentWithoutNode.children,
            ];

            const insertIndex =
                position.type === "before"
                    ? targetIndex
                    : targetIndex + 1;

            children.splice(
                insertIndex,
                0,
                removedNode,
            );

            return {
                ...documentWithoutNode,
                children,
            };
        }
    }

    /*
     * Nested insert.
     */
    const children =
        documentWithoutNode.children.map(
            (child) =>
                insertNode(
                    child,
                    removedNode,
                    position,
                ),
        );

    return {
        ...documentWithoutNode,
        children,
    };
}