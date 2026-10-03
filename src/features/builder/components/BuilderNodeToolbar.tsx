"use client";

import { useBuilder } from "@/features/builder/store/BuilderProvider";

export function BuilderNodeToolbar() {
    const { state, dispatch } = useBuilder();

    const selectedNodeId = state.selectedNodeId;

    if (selectedNodeId === null) {
        return null;
    }

    function handleDelete() {
        const nodeId = state.selectedNodeId;

        if (nodeId === null) {
            return;
        }

        dispatch({
            type: "DELETE_NODE",
            nodeId,
        });
    }

    function handleDuplicate() {
        const nodeId = state.selectedNodeId;

        if (nodeId === null) {
            return;
        }

        dispatch({
            type: "DUPLICATE_NODE",
            nodeId,
        });
    }

    function handleMoveUp() {
        const nodeId = state.selectedNodeId;

        if (nodeId === null) {
            return;
        }

        dispatch({
            type: "MOVE_NODE_UP",
            nodeId,
        });
    }

    function handleMoveDown() {
        const nodeId = state.selectedNodeId;

        if (nodeId === null) {
            return;
        }

        dispatch({
            type: "MOVE_NODE_DOWN",
            nodeId,
        });
    }

    return (
        <div
            className={[
                "absolute left-1/2 top-0",
                "z-[99999]",
                "-translate-x-1/2",
                "-translate-y-[calc(100%+8px)]",
                "flex items-center gap-1",
                "rounded-lg border border-slate-200",
                "bg-white p-1",
                "shadow-xl",
                "whitespace-nowrap",
                "pointer-events-auto",
                "select-none",
            ].join(" ")}
            onClick={(event) => {
                event.stopPropagation();
            }}
            onMouseDown={(event) => {
                event.stopPropagation();
            }}
            draggable={false}
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