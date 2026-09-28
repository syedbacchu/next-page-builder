"use client";

import { useBuilder } from "@/features/builder/store/BuilderProvider";

export function BuilderNodeToolbar() {
    const { state, dispatch } = useBuilder();

    if (!state.selectedNodeId) {
        return null;
    }

    function handleDelete() {
        if (!state.selectedNodeId) {
            return;
        }

        dispatch({
            type: "DELETE_NODE",
            nodeId: state.selectedNodeId,
        });
    }
    function handleDuplicate() {
        if (!state.selectedNodeId) {
            return;
        }

        dispatch({
            type: "DUPLICATE_NODE",
            nodeId: state.selectedNodeId,
        });
    }
    function handleMoveUp() {
        if (!state.selectedNodeId) {
            return;
        }

        dispatch({
            type: "MOVE_NODE_UP",
            nodeId: state.selectedNodeId,
        });
    }

    function handleMoveDown() {
        if (!state.selectedNodeId) {
            return;
        }

        dispatch({
            type: "MOVE_NODE_DOWN",
            nodeId: state.selectedNodeId,
        });
    }

    return (
        <div
            className="absolute left-0 top-0 z-[9999] flex items-center gap-1 rounded-md border bg-white p-1 shadow-lg"
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            <button
                type="button"
                onClick={handleMoveUp}
                className="rounded px-2 py-1.5 text-xs font-medium hover:bg-gray-100"
            >
                ↑
            </button>

            <button
                type="button"
                onClick={handleMoveDown}
                className="rounded px-2 py-1.5 text-xs font-medium hover:bg-gray-100"
            >
                ↓
            </button>

            <button
                type="button"
                onClick={handleDuplicate}
                className="rounded px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
            >
                Duplicate
            </button>

            <button
                type="button"
                onClick={handleDelete}
                className="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
            >
                Delete
            </button>
        </div>
    );
}