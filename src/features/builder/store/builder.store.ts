import { updateNodeProps } from "@/features/builder/utils/update-node-props";
import { updateNodeStyles } from "@/features/builder/utils/update-node-styles";
import { addNodeToParent } from "@/features/builder/utils/add-node";
import type {
    BuilderDocument,
    BuilderNode,
} from "@/features/builder/types/builder.types";
import { findFirstContainer } from "@/features/builder/utils/find-first-container";
import { deleteNode } from "@/features/builder/utils/delete-node";
import { duplicateNode } from "@/features/builder/utils/duplicate-node";
import { moveNodeUp, moveNodeDown } from "@/features/builder/utils/move-node";

export interface BuilderHistory {
    past: BuilderDocument[];
    future: BuilderDocument[];
}

export interface BuilderState {
    document: BuilderDocument;
    selectedNodeId: string | null;
    insertTargetNodeId: string | null;
    history: BuilderHistory;
}

export type BuilderAction =
    | {
    type: "SELECT_NODE";
    nodeId: string | null;
}
    | {
    type: "SET_DOCUMENT";
    document: BuilderDocument;
}
| {
    type: "UPDATE_NODE_PROPS";
    nodeId: string;
    props: Record<string, unknown>;
}
| {
    type: "UPDATE_NODE_STYLES";
    nodeId: string;
    styles: Record<string, string>;
}
| {
    type: "ADD_NODE";
    parentId: string;
    node: BuilderNode;
}| {
    type: "DELETE_NODE";
    nodeId: string;
}| {
    type: "SET_INSERT_TARGET";
    nodeId: string;
}| {
    type: "DUPLICATE_NODE";
    nodeId: string;
}| {
    type: "MOVE_NODE_UP";
    nodeId: string;
}| {
    type: "MOVE_NODE_DOWN";
    nodeId: string;
}| {
    type: "UNDO";
}| {
    type: "REDO";
};

export function createInitialBuilderState(
    document: BuilderDocument,
): BuilderState {
    const firstContainer = findFirstContainer(document);

    return {
        document,
        selectedNodeId: null,
        insertTargetNodeId: firstContainer?.id ?? null,
        history: {
            past: [],
            future: [],
        },
    };
}

function commitDocument(
    state: BuilderState,
    document: BuilderDocument,
): BuilderState {
    return {
        ...state,
        document,
        history: {
            past: [...state.history.past, state.document],
            future: [],
        },
    };
}

export function builderReducer(
    state: BuilderState,
    action: BuilderAction,
): BuilderState {
    switch (action.type) {
        case "SELECT_NODE":
            return {
                ...state,
                selectedNodeId: action.nodeId,
            };

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
                    updateNodeStyles(child, action.nodeId, action.styles),
                ),
            });
        case "ADD_NODE":
            return {
                ...commitDocument(state, {
                    ...state.document,
                    children: state.document.children.map((child) =>
                        addNodeToParent(child, action.parentId, action.node),
                    ),
                }),
                selectedNodeId: action.node.id,
            };
        case "DELETE_NODE":
            return {
                ...commitDocument(state, {
                    ...state.document,
                    children: state.document.children.map((child) =>
                        deleteNode(child, action.nodeId),
                    ),
                }),
                selectedNodeId: null,
            };
        case "SET_INSERT_TARGET":
            return {
                ...state,
                insertTargetNodeId: action.nodeId,
            };
        case "DUPLICATE_NODE": {
            const result = duplicateNode(
                state.document,
                action.nodeId,
            );

            if (!result.duplicatedNode) {
                return state;
            }

            return {
                ...commitDocument(state, result.document),
                selectedNodeId: result.duplicatedNode.id,
            };
        }
        case "MOVE_NODE_UP":
            return commitDocument(state, {
                ...state.document,
                children: state.document.children.map((child) =>
                    moveNodeUp(child, action.nodeId),
                ),
            });
        case "MOVE_NODE_DOWN":
            return commitDocument(state, {
                ...state.document,
                children: state.document.children.map((child) =>
                    moveNodeDown(child, action.nodeId),
                ),
            });
        case "UNDO": {
            const previousDocument =
                state.history.past[
                state.history.past.length - 1
                    ];

            if (!previousDocument) {
                return state;
            }

            return {
                ...state,
                document: previousDocument,
                history: {
                    past: state.history.past.slice(0, -1),
                    future: [
                        state.document,
                        ...state.history.future,
                    ],
                },
            };
        }
        case "REDO": {
            const nextDocument = state.history.future[0];

            if (!nextDocument) {
                return state;
            }

            return {
                ...state,
                document: nextDocument,
                history: {
                    past: [
                        ...state.history.past,
                        state.document,
                    ],
                    future: state.history.future.slice(1),
                },
            };
        }
        default:
            return state;
    }
}