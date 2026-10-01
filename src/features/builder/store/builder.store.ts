import { updateNodeProps } from "@/features/builder/utils/update-node-props";
import { updateNodeStyles } from "@/features/builder/utils/update-node-styles";
import { addNodeToParent } from "@/features/builder/utils/add-node";
import type {
    BuilderDocument,
    BuilderNode,
    BuilderNodeStyles
} from "@/features/builder/types/builder.types";
import { findFirstContainer } from "@/features/builder/utils/find-first-container";
import { deleteNode } from "@/features/builder/utils/delete-node";
import { duplicateNode } from "@/features/builder/utils/duplicate-node";
import { moveNodeUp, moveNodeDown } from "@/features/builder/utils/move-node";
import { findNodePosition } from "@/features/builder/utils/find-node-position";
import { insertNodeAtPosition } from "@/features/builder/utils/insert-node-at-position";
import type { DropPosition } from "@/features/builder/types/drop-position.types";
import { moveNodeToPosition } from "@/features/builder/utils/move-node-to-position";
import {findNodeById} from "@/features/builder/utils/find-node";
import {canAddNodeToParent} from "@/features/builder/utils/can-add-node";
import { canDropNode } from "@/features/builder/utils/can-drop-node";
import { selectNode } from "@/features/builder/utils/select-node";
import { findParentNode } from "@/features/builder/utils/find-parent-node";
import {BuilderViewport} from "@/features/builder/types/builder-viewport.types";
import { setColumnSpan } from "@/features/builder/utils/set-column-span";
import { setResponsiveColumnLayout } from "@/features/builder/utils/set-responsive-column-layout";
import type {
    BuilderAction,
    BuilderHistory,
    BuilderState,
} from "@/features/builder/store/builder.types";
import {
    commitDocument,
    undo,
    redo,
} from "@/features/builder/store/builder.history";
import {handleNodeAction} from "@/features/builder/store/builder.nodes";


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
    };
}

function getDefaultInsertTarget(
    document: BuilderDocument,
): string {
    const firstContainer = findFirstContainer(document);

    return firstContainer?.id ?? document.id;
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
                        action.styles,
                    ),
                ),
            });
        case "ADD_NODE":
            return handleNodeAction(state, action);
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
        case "UNDO":
            return undo(state);
        case "REDO":
            return redo(state);
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

            const newDocument = moveNodeToPosition(
                state.document,
                activeNodeId,
                dropPosition,
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
        case "SET_VIEWPORT":
            return {
                ...state,
                viewport: action.viewport,
            };
        case "START_COLUMN_RESIZE":
            return {
                ...state,
                resize: {
                    active: true,
                    nodeId: action.nodeId,
                    nextNodeId: action.nextNodeId,
                    startX: action.startX,
                    startSpan: action.startSpan,
                    nextStartSpan: action.nextStartSpan,
                    startDocument: state.document,
                },
            };
        case "END_COLUMN_RESIZE": {
            if (
                !state.resize.active ||
                !state.resize.startDocument
            ) {
                return {
                    ...state,
                    resize: {
                        active: false,
                        nodeId: null,
                        nextNodeId: null,
                        startX: null,
                        startSpan: null,
                        nextStartSpan: null,
                        startDocument: null,
                    },
                };
            }

            const hasChanged =
                state.document !== state.resize.startDocument;

            if (!hasChanged) {
                return {
                    ...state,
                    resize: {
                        active: false,
                        nodeId: null,
                        nextNodeId: null,
                        startX: null,
                        startSpan: null,
                        nextStartSpan: null,
                        startDocument: null,
                    },
                };
            }

            return {
                ...state,
                history: {
                    past: [
                        ...state.history.past,
                        state.resize.startDocument,
                    ],
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
            };
        }
        case "UPDATE_COLUMN_RESIZE": {
            const currentDocument = state.document;

            const currentNode = findNodeById(
                currentDocument,
                action.nodeId,
            );

            const nextNode = findNodeById(
                currentDocument,
                action.nextNodeId,
            );

            if (!currentNode || !nextNode) {
                return state;
            }

            const document = {
                ...currentDocument,
                children: currentDocument.children.map((child) =>
                    updateNodeProps(
                        updateNodeProps(
                            child,
                            action.nodeId,
                            {
                                span: setColumnSpan(
                                    currentNode.props.span,
                                    action.viewport,
                                    action.span,
                                ),
                            },
                        ),
                        action.nextNodeId,
                        {
                            span: setColumnSpan(
                                nextNode.props.span,
                                action.viewport,
                                action.nextSpan,
                            ),
                        },
                    ),
                ),
            };

            return {
                ...state,
                document,
            };
        }
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
        default:
            return state;
    }
}