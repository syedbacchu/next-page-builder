import type {
    BuilderState,
} from "@/features/builder/store/builder.types";

import type {
    BuilderDocument,
} from "@/features/builder/types/builder.types";
import { findFirstContainer } from "@/features/builder/utils/find-first-container";

function getDefaultInsertTarget(
    document: BuilderDocument,
): string {
    return (
        findFirstContainer(document)?.id ??
        document.id
    );
}

export function commitDocument(
    state: BuilderState,
    document: BuilderDocument,
): BuilderState {
    return {
        ...state,
        document,
        history: {
            past: [
                ...state.history.past,
                state.document,
            ],
            future: [],
        },
    };
}

export function undo(
    state: BuilderState,
): BuilderState {
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

        selectedNodeId: null,

        insertTargetNodeId:
            getDefaultInsertTarget(previousDocument),

        drag: {
            activeNodeId: null,
            dropPosition: null,
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

        history: {
            past: state.history.past.slice(0, -1),

            future: [
                state.document,
                ...state.history.future,
            ],
        },
    };
}

export function redo(
    state: BuilderState,
): BuilderState {
    const nextDocument =
        state.history.future[0];

    if (!nextDocument) {
        return state;
    }

    return {
        ...state,

        document: nextDocument,

        selectedNodeId: null,

        insertTargetNodeId:
            getDefaultInsertTarget(nextDocument),

        drag: {
            activeNodeId: null,
            dropPosition: null,
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

        history: {
            past: [
                ...state.history.past,
                state.document,
            ],

            future:
                state.history.future.slice(1),
        },
    };
}