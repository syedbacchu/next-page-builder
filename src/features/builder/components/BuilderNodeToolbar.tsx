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
            className={[
                "absolute right-full top-1/2 z-[9999]",
                "mr-2 -translate-y-1/2",
                "flex flex-col items-center gap-1",
                "rounded-lg border border-slate-200",
                "bg-white p-1",
                "shadow-lg",
            ].join(" ")}
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            <button
                type="button"
                onClick={handleMoveUp}
                title="Move up"
                className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
                ↑
            </button>

            <button
                type="button"
                onClick={handleMoveDown}
                title="Move down"
                className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
                ↓
            </button>

            <button
                type="button"
                onClick={handleDuplicate}
                title="Duplicate"
                className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
                ⧉
            </button>

            <button
                type="button"
                onClick={handleDelete}
                title="Delete"
                className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
            >
                🗑
            </button>
        </div>
    );
}