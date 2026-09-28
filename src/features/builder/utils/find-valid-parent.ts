import type {
    BuilderDocument,
    BuilderNode,
    BuilderNodeType,
} from "@/features/builder/types/builder.types";

import { componentRegistry } from "@/features/builder/registry/component-registry";

import { findNodeById } from "@/features/builder/utils/find-node";

import { canAddNodeToParent } from "@/features/builder/utils/can-add-node";

import { createBuilderNode } from "@/features/builder/utils/create-node";

function findParentNode(
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

export function findValidParentForComponent(
    document: BuilderDocument,
    targetNodeId: string,
    componentType: BuilderNodeType,
): BuilderNode | null {
    const targetNode = findNodeById(
        document,
        targetNodeId,
    );

    if (!targetNode) {
        return null;
    }

    const componentDefinition =
        componentRegistry[componentType];

    if (!componentDefinition) {
        return null;
    }

    const testNode =
        createBuilderNode(componentType);

    // Current target can contain the component.
    if (
        canAddNodeToParent(
            testNode,
            targetNode,
        )
    ) {
        return targetNode;
    }

    // Walk upward until a valid parent is found.
    let currentNode: BuilderNode | null =
        targetNode;

    while (currentNode) {
        const parent = findParentNode(
            document,
            currentNode.id,
        );

        if (!parent) {
            break;
        }

        if (
            canAddNodeToParent(
                testNode,
                parent,
            )
        ) {
            return parent;
        }

        currentNode = parent;
    }

    return null;
}