import type {
    BuilderAction,
    BuilderState,
} from "@/features/builder/store/builder.types";
import { canDropNode } from "@/features/builder/utils/can-drop-node";
import { moveNodeToPosition } from "@/features/builder/utils/move-node-to-position";
import { commitDocument } from "@/features/builder/store/builder.history";

export function handleDragAction(
    state: BuilderState,
    action: BuilderAction,
): BuilderState {
    switch (action.type) {
        case "DRAG_START":
            return {
                ...state,
                drag: {
                    activeNodeId: action.nodeId,
                    dropPosition: null,
                },
            };

        case "DRAG_END":
            return {
                ...state,
                drag: {
                    activeNodeId: null,
                    dropPosition: null,
                },
            };

        case "SET_DROP_POSITION":
            return {
                ...state,
                drag: {
                    ...state.drag,
                    dropPosition: action.position,
                },
            };

        case "DROP_NODE": {
            const { activeNodeId, dropPosition } = state.drag;

            if (!activeNodeId || !dropPosition) {
                return {
                    ...state,
                    drag: {
                        activeNodeId: null,
                        dropPosition: null,
                    },
                };
            }

            // Final drop validation
            if (
                !canDropNode(
                    state.document,
                    activeNodeId,
                    dropPosition,
                )
            ) {
                return {
                    ...state,
                    drag: {
                        activeNodeId: null,
                        dropPosition: null,
                    },
                };
            }
            console.log("=== DROP NODE ===");

            console.log("ACTIVE NODE:", activeNodeId);

            console.log("DROP POSITION:", dropPosition);

            console.log(
                "CAN DROP:",
                canDropNode(
                    state.document,
                    activeNodeId,
                    dropPosition,
                ),
            );
            const newDocument = moveNodeToPosition(
                state.document,
                activeNodeId,
                dropPosition,
            );
            console.log(
                "DOCUMENT CHANGED:",
                newDocument !== state.document,
            );
            return {
                ...commitDocument(state, newDocument),

                selectedNodeId: activeNodeId,

                drag: {
                    activeNodeId: null,
                    dropPosition: null,
                },
            };
        }

        default:
            return state;
    }
}