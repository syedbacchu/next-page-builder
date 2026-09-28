import type { BuilderNode } from "@/features/builder/types/builder.types";
import type { DropPosition } from "@/features/builder/types/drop-position.types";
import { componentRegistry } from "@/features/builder/registry/component-registry";
import { findNodeById } from "@/features/builder/utils/find-node";

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

export function canDropNode(
    document: BuilderNode,
    sourceNodeId: string,
    position: DropPosition,
): boolean {
    if (sourceNodeId === document.id) {
        return false;
    }

    const sourceNode = findNodeById(
        document,
        sourceNodeId,
    );

    if (!sourceNode) {
        return false;
    }

    if (sourceNode.id === position.targetNodeId) {
        return false;
    }

    if (
        position.type === "inside" &&
        containsNode(sourceNode, position.targetNodeId)
    ) {
        return false;
    }

    if (position.type !== "inside") {
        const targetNode = findNodeById(
            document,
            position.targetNodeId,
        );

        if (!targetNode) {
            return false;
        }

        // Find the parent of the target node.
        function findParent(
            current: BuilderNode,
            targetId: string,
        ): BuilderNode | null {
            for (const child of current.children) {
                if (child.id === targetId) {
                    return current;
                }

                const parent = findParent(child, targetId);

                if (parent) {
                    return parent;
                }
            }

            return null;
        }

        const parentNode = findParent(
            document,
            targetNode.id,
        );

        if (!parentNode) {
            return false;
        }

        const sourceDefinition =
            componentRegistry[sourceNode.type];

        if (
            sourceDefinition?.allowedParentTypes &&
            !sourceDefinition.allowedParentTypes.includes(
                parentNode.type,
            )
        ) {
            return false;
        }

        return true;
    }

    const targetNode = findNodeById(
        document,
        position.targetNodeId,
    );

    if (!targetNode) {
        return false;
    }

    const targetDefinition =
        componentRegistry[targetNode.type];

    if (!targetDefinition?.canHaveChildren) {
        return false;
    }

    const sourceDefinition =
        componentRegistry[sourceNode.type];

    if (
        sourceDefinition?.allowedParentTypes &&
        !sourceDefinition.allowedParentTypes.includes(
            targetNode.type,
        )
    ) {
        return false;
    }

    return true;
}