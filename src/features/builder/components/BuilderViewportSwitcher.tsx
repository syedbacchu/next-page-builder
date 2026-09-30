"use client";

import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import { useBuilder } from "@/features/builder/store/BuilderProvider";

const viewports: {
    value: BuilderViewport;
    label: string;
}[] = [
    {
        value: "desktop",
        label: "Desktop",
    },
    {
        value: "tablet",
        label: "Tablet",
    },
    {
        value: "mobile",
        label: "Mobile",
    },
];

export function BuilderViewportSwitcher() {
    const { state, dispatch } = useBuilder();

    return (
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {viewports.map((viewport) => {
                const isActive =
                    state.viewport === viewport.value;

                return (
                    <button
                        key={viewport.value}
                        type="button"
                        onClick={() =>
                            dispatch({
                                type: "SET_VIEWPORT",
                                viewport: viewport.value,
                            })
                        }
                        className={[
                            "rounded-md px-3 py-1.5 text-xs font-medium",
                            "transition",
                            isActive
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-900",
                        ].join(" ")}
                    >
                        {viewport.label}
                    </button>
                );
            })}
        </div>
    );
}