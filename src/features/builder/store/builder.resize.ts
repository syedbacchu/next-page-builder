import type {
    BuilderAction,
    BuilderState,
} from "@/features/builder/store/builder.types";
import {findNodeById} from "@/features/builder/utils/find-node";
import {setResponsiveColumnLayout} from "@/features/builder/utils/set-responsive-column-layout";
import type {BuilderDocument, BuilderNode} from "@/features/builder/types/builder.types";
import {commitDocument} from "@/features/builder/store/builder.history";
import {updateNodeProps} from "@/features/builder/utils/update-node-props";
import {setColumnSpan} from "@/features/builder/utils/set-column-span";

export function handleResizeAction(
    state: BuilderState,
    action: BuilderAction,
): BuilderState {
    switch (action.type) {
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
        default:
            return state;
    }
}