"use client";

import { useBuilder } from "@/features/builder/store/BuilderProvider";

export function BuilderHistoryToolbar() {
    const { state, dispatch } = useBuilder();

    const canUndo = state.history.past.length > 0;
    const canRedo = state.history.future.length > 0;

    return (
        <div className="flex items-center gap-1 border-b bg-white p-2">
            <button
                type="button"
                disabled={!canUndo}
                onClick={() => {
                    dispatch({ type: "UNDO" });
                }}
                className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
                ↶ Undo
            </button>

            <button
                type="button"
                disabled={!canRedo}
                onClick={() => {
                    dispatch({ type: "REDO" });
                }}
                className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
                ↷ Redo
            </button>
        </div>
    );
}