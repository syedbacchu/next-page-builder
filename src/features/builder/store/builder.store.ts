import { updateNodeProps } from "@/features/builder/utils/update-node-props";
import { updateNodeStyles } from "@/features/builder/utils/update-node-styles";
import { addNodeToParent } from "@/features/builder/utils/add-node";
import type {
    BuilderDocument,
    BuilderNode,
} from "@/features/builder/types/builder.types";
import { findFirstContainer } from "@/features/builder/utils/find-first-container";

export interface BuilderState {
    document: BuilderDocument;
    selectedNodeId: string | null;
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
};

export function createInitialBuilderState(
    document: BuilderDocument,
): BuilderState {
    const firstContainer = findFirstContainer(document);

    return {
        document,
        selectedNodeId: firstContainer?.id ?? null,
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

        default:
            return state;
    }
}