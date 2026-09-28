"use client";

import { useBuilder } from "@/features/builder/store/BuilderProvider";

export function BuilderDropIndicator() {
    const { state } = useBuilder();

    const position = state.drag.dropPosition;

    if (!position) {
        return null;
    }

    if (position.type === "inside") {
        return (
            <div className="pointer-events-none absolute inset-0 z-[9998] rounded-md border-2 border-dashed border-blue-500 bg-blue-500/5">
                <div className="absolute left-2 top-2 rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white shadow">
                    Drop inside
                </div>
            </div>
        );
    }

    return (
        <div
            className={[
                "builder-drop-indicator",
                `builder-drop-indicator-${position.type}`,
            ].join(" ")}
        />
    );
}