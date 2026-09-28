import { updateNodeProps } from "@/features/builder/utils/update-node-props";
import { updateNodeStyles } from "@/features/builder/utils/update-node-styles";
import { addNodeToParent } from "@/features/builder/utils/add-node";
import type {
    BuilderDocument,
    BuilderNode,
} from "@/features/builder/types/builder.types";
import { findFirstContainer } from "@/features/builder/utils/find-first-container";
import { deleteNode } from "@/features/builder/utils/delete-node";

export interface BuilderState {
    document: BuilderDocument;
    selectedNodeId: string | null;
    insertTargetNodeId: string | null;
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
};

export function createInitialBuilderState(
    document: BuilderDocument,
): BuilderState {
    const firstContainer = findFirstContainer(document);

    return {
        document,
        selectedNodeId: null,
        insertTargetNodeId: firstContainer?.id ?? null,
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
            return {
                ...state,
                document: {
                    ...state.document,
                    children: state.document.children.map((child) =>
                        updateNodeProps(
                            child,
                            action.nodeId,
                            action.props,
                        ),
                    ),
                },
            };
        case "UPDATE_NODE_STYLES":
            return {
                ...state,
                document: {
                    ...state.document,
                    children: state.document.children.map(
                        (child) =>
                            updateNodeStyles(
                                child,
                                action.nodeId,
                                action.styles,
                            ),
                    ),
                },
            };
        case "ADD_NODE":
            return {
                ...state,
                document: {
                    ...state.document,
                    children: state.document.children.map((child) =>
                        addNodeToParent(
                            child,
                            action.parentId,
                            action.node,
                        ),
                    ),
                },
                selectedNodeId: action.node.id,
            };
        case "DELETE_NODE":
            return {
                ...state,
                document: {
                    ...state.document,
                    children: state.document.children.map((child) =>
                        deleteNode(child, action.nodeId),
                    ),
                },
                selectedNodeId: null,
            };
        case "SET_INSERT_TARGET":
            return {
                ...state,
                insertTargetNodeId: action.nodeId,
            };

        default:
            return state;
    }
}