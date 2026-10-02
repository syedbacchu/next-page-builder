import type {
    BuilderAction,
    BuilderState,
} from "@/features/builder/store/builder.types";
import {findNodeById} from "@/features/builder/utils/find-node";
import {canAddNodeToParent} from "@/features/builder/utils/can-add-node";
import type {BuilderDocument} from "@/features/builder/types/builder.types";
import {addNodeToParent} from "@/features/builder/utils/add-node";
import {commitDocument} from "@/features/builder/store/builder.history";
import { findParentNode } from "@/features/builder/utils/find-parent-node";
import { deleteNode } from "@/features/builder/utils/delete-node";
import {duplicateNode} from "@/features/builder/utils/duplicate-node";
import {moveNodeDown, moveNodeUp} from "@/features/builder/utils/move-node";
import {findNodePosition} from "@/features/builder/utils/find-node-position";
import {insertNodeAtPosition} from "@/features/builder/utils/insert-node-at-position";

export function handleNodeAction(
    state: BuilderState,
    action: BuilderAction,
): BuilderState {
    switch (action.type) {
        case "ADD_NODE": {
            const parent = findNodeById(
                state.document,
                action.parentId,
            );

            if (!parent) {
                return state;
            }

            if (!canAddNodeToParent(action.node, parent)) {
                return state;
            }

            let document: BuilderDocument;

            // Adding directly to the root Page
            if (action.parentId === state.document.id) {
                const children =
                    action.index === undefined
                        ? [
                            ...state.document.children,
                            action.node,
                        ]
                        : [
                            ...state.document.children.slice(
                                0,
                                action.index,
                            ),
                            action.node,
                            ...state.document.children.slice(
                                action.index,
                            ),
                        ];

                document = {
                    ...state.document,
                    children,
                };
            } else {
                // Adding to nested node
                const children =
                    state.document.children.map((child) =>
                        addNodeToParent(
                            child,
                            action.parentId,
                            action.node,
                            action.index,
                        ),
                    );

                document = {
                    ...state.document,
                    children,
                };
            }

            return {
                ...commitDocument(
                    state,
                    document,
                ),
                selectedNodeId: action.node.id,
                insertTargetNodeId: action.node.id,
            };
        }

        case "DELETE_NODE": {
            // Root Page cannot be deleted.
            if (action.nodeId === state.document.id) {
                return state;
            }

            const node = findNodeById(
                state.document,
                action.nodeId,
            );

            if (!node) {
                return state;
            }

            const parentNode = findParentNode(
                state.document,
                action.nodeId,
            );

            const document = {
                ...state.document,
                children: state.document.children.map((child) =>
                    deleteNode(child, action.nodeId),
                ),
            };

            return {
                ...commitDocument(state, document),

                // Select the deleted node's parent.
                selectedNodeId:
                    parentNode?.id ?? null,

                // If deleted node was the insert target,
                // use the parent as the new insert target.
                insertTargetNodeId:
                    state.insertTargetNodeId === action.nodeId
                        ? parentNode?.id ?? null
                        : state.insertTargetNodeId,
            };
        }

        case "DUPLICATE_NODE": {
            // Root Page cannot be duplicated.
            if (action.nodeId === state.document.id) {
                return state;
            }

            const result = duplicateNode(
                state.document,
                action.nodeId,
            );

            if (!result.duplicatedNode) {
                return state;
            }

            return {
                ...commitDocument(
                    state,
                    result.document,
                ),
                selectedNodeId:
                result.duplicatedNode.id,
                insertTargetNodeId:
                result.duplicatedNode.id,
            };
        }

        case "MOVE_NODE_UP": {
            const newChildren = state.document.children.map(
                (child) =>
                    moveNodeUp(
                        child,
                        action.nodeId,
                    ),
            );

            const hasChanged = newChildren.some(
                (child, index) =>
                    child !== state.document.children[index],
            );

            if (!hasChanged) {
                return state;
            }

            const document = {
                ...state.document,
                children: newChildren,
            };

            return commitDocument(
                state,
                document,
            );
        }

        case "MOVE_NODE_DOWN": {
            const newChildren = state.document.children.map(
                (child) =>
                    moveNodeDown(
                        child,
                        action.nodeId,
                    ),
            );

            const hasChanged = newChildren.some(
                (child, index) =>
                    child !== state.document.children[index],
            );

            if (!hasChanged) {
                return state;
            }

            const document = {
                ...state.document,
                children: newChildren,
            };

            return commitDocument(
                state,
                document,
            );
        }

        case "ADD_NODE_BEFORE": {
            const position = findNodePosition(
                state.document,
                action.targetNodeId,
            );

            if (!position) {
                return state;
            }

            const document = {
                ...state.document,
                children: state.document.children.map((child) =>
                    insertNodeAtPosition(
                        child,
                        position.parentId,
                        action.node,
                        position.index,
                    ),
                ),
            };

            return {
                ...commitDocument(state, document),
                selectedNodeId: action.node.id,
            };
        }
        case "ADD_NODE_AFTER": {
            const position = findNodePosition(
                state.document,
                action.targetNodeId,
            );

            if (!position) {
                return state;
            }

            const document = {
                ...state.document,
                children: state.document.children.map((child) =>
                    insertNodeAtPosition(
                        child,
                        position.parentId,
                        action.node,
                        position.index + 1,
                    ),
                ),
            };

            return {
                ...commitDocument(state, document),
                selectedNodeId: action.node.id,
            };
        }

        default:
            return state;
    }
}