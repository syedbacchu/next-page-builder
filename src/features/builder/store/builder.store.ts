import { updateNodeProps } from "@/features/builder/utils/update-node-props";
import { updateNodeStyles } from "@/features/builder/utils/update-node-styles";
import type {
    BuilderDocument,
    BuilderNode,

} from "@/features/builder/types/builder.types";
import { findFirstContainer } from "@/features/builder/utils/find-first-container";

import {findNodeById} from "@/features/builder/utils/find-node";
import { selectNode } from "@/features/builder/utils/select-node";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import { setResponsiveColumnLayout } from "@/features/builder/utils/set-responsive-column-layout";
import type {
    BuilderAction,
    BuilderState,
} from "@/features/builder/store/builder.types";
import {
    commitDocument,
    undo,
    redo,
} from "@/features/builder/store/builder.history";
import {handleNodeAction} from "@/features/builder/store/builder.nodes";
import {handleDragAction} from "@/features/builder/store/builder.drag";
import {handleResizeAction} from "@/features/builder/store/builder.resize";
import { setResponsiveStyle } from "@/features/builder/utils/set-responsive-style";
import {
    updateNodeInteractionStyles,
} from "@/features/builder/utils/update-node-interaction-styles";

export function createInitialBuilderState(
    document: BuilderDocument,
    viewport: BuilderViewport = "desktop",
): BuilderState {
    const firstContainer = findFirstContainer(document);

    return {
        document,
        selectedNodeId: null,
        insertTargetNodeId: firstContainer?.id ?? null,

        viewport,

        history: {
            past: [],
            future: [],
        },
        resize: {
            active: false,
            nodeId: null,
            nextNodeId: null,
            startX: null,
            startSpan: null,
            nextStartSpan: null,
            startDocument: null,
        },
        drag: {
            activeNodeId: null,
            dropPosition: null,
        },
        page: {
            id: null,
            title: "My First Page",
            slug: "my-first-page",
            status: "draft",
        },
    };
}

export function builderReducer(
    state: BuilderState,
    action: BuilderAction,
): BuilderState {
    switch (action.type) {
        case "SELECT_NODE":
            return selectNode(
                state,
                action.nodeId,
            );

        case "SET_DOCUMENT":
            return {
                ...state,
                document: action.document,
            };
        case "UPDATE_NODE_PROPS":
            return commitDocument(state, {
                ...state.document,
                children: state.document.children.map((child) =>
                    updateNodeProps(child, action.nodeId, action.props),
                ),
            });
        case "UPDATE_NODE_STYLES":
            return commitDocument(state, {
                ...state.document,
                children: state.document.children.map((child) =>
                    updateNodeStyles(
                        child,
                        action.nodeId,
                        setResponsiveStyle(
                            child.styles,
                            action.viewport,
                            action.key,
                            action.value,
                        ),
                    ),
                ),
            });
        case "UPDATE_NODE_INTERACTION_STYLES":
            return commitDocument(state, {
                ...state.document,

                children: state.document.children.map((child) =>
                    updateNodeInteractionStyles(
                        child,
                        action.nodeId,
                        action.interaction,
                        action.viewport,
                        action.key,
                        action.value,
                    ),
                ),
            });

        case "ADD_NODE":
        case "DELETE_NODE":
        case "DUPLICATE_NODE":
        case "MOVE_NODE_UP":
        case "MOVE_NODE_DOWN":
        case "ADD_NODE_BEFORE":
        case "ADD_NODE_AFTER":
            return handleNodeAction(state, action);

        case "DRAG_START":
        case "DRAG_END":
        case "SET_DROP_POSITION":
        case "DROP_NODE":
            return handleDragAction(state, action);

        case "START_COLUMN_RESIZE":
        case "UPDATE_COLUMN_RESIZE":
        case "END_COLUMN_RESIZE":
            return handleResizeAction(state, action);

        case "SET_INSERT_TARGET": {
            if (action.nodeId === null) {
                return {
                    ...state,
                    insertTargetNodeId: null,
                };
            }

            const node = findNodeById(
                state.document,
                action.nodeId,
            );

            if (!node) {
                return state;
            }

            return {
                ...state,
                insertTargetNodeId: node.id,
            };
        }


        case "UNDO":
            return undo(state);
        case "REDO":
            return redo(state);

        case "SET_VIEWPORT":
            return {
                ...state,
                viewport: action.viewport,
            };

        case "SET_RESPONSIVE_COLUMN_LAYOUT": {
            const row = findNodeById(
                state.document,
                action.rowId,
            );

            if (!row || row.type !== "row") {
                return state;
            }

            const columns = row.children.filter(
                (child) => child.type === "column",
            );

            if (columns.length === 0) {
                return state;
            }

            const updatedColumns = setResponsiveColumnLayout(
                columns,
                action.viewport,
                action.columnsPerRow,
            );

            let columnIndex = 0;

            const updatedRow = {
                ...row,
                children: row.children.map((child) => {
                    if (child.type !== "column") {
                        return child;
                    }

                    return updatedColumns[columnIndex++];
                }),
            };

            const updateRow = (
                node: BuilderNode,
            ): BuilderNode => {
                if (node.id === action.rowId) {
                    return updatedRow;
                }

                return {
                    ...node,
                    children: node.children.map(updateRow),
                };
            };

            const document: BuilderDocument = {
                ...state.document,
                children: state.document.children.map(updateRow),
            };

            return commitDocument(state, document);
        }
        case "SET_PAGE_META":
            return {
                ...state,
                page: {
                    ...state.page,
                    ...action.page,
                },
            };
        default:
            return state;
    }
}