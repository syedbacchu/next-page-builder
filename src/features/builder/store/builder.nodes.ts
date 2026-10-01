import type {
    BuilderAction,
    BuilderState,
} from "@/features/builder/store/builder.types";
import {findNodeById} from "@/features/builder/utils/find-node";
import {canAddNodeToParent} from "@/features/builder/utils/can-add-node";
import type {BuilderDocument} from "@/features/builder/types/builder.types";
import {addNodeToParent} from "@/features/builder/utils/add-node";
import {commitDocument} from "@/features/builder/store/builder.history";

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

        case "DELETE_NODE":
        case "DUPLICATE_NODE":
        case "MOVE_NODE_UP":
        case "MOVE_NODE_DOWN":
        case "ADD_NODE_BEFORE":
        case "ADD_NODE_AFTER":
            return state;

        default:
            return state;
    }
}