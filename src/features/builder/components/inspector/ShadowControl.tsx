"use client";

import type { BuilderNode } from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import { getStyleValue } from "@/features/builder/types/builder.types";

interface ShadowControlProps {
    node: BuilderNode;
    viewport: BuilderViewport;
    onChange: (key: string, value: string) => void;
}

const shadowPresets = [
    {
        value: "none",
        label: "None",
    },
    {
        value: "0 1px 3px rgba(0,0,0,0.12)",
        label: "Small",
    },
    {
        value: "0 4px 12px rgba(0,0,0,0.12)",
        label: "Medium",
    },
    {
        value: "0 10px 30px rgba(0,0,0,0.15)",
        label: "Large",
    },
];

function getValue(
    node: BuilderNode,
    viewport: BuilderViewport,
    key: string,
    fallback = "",
) {
    return (
        getStyleValue(
            node.styles,
            key,
            viewport,
        ) ?? fallback
    );
}

export function ShadowControl({
                                  node,
                                  viewport,
                                  onChange,
                              }: ShadowControlProps) {
    const shadow = getValue(
        node,
        viewport,
        "box-shadow",
        "none",
    );

    return (
        <div className="rounded-lg border border-slate-200 p-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Box Shadow
            </h3>

            <div className="space-y-4">
                {/* Presets */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Preset
                    </label>

                    <select
                        value={
                            shadowPresets.some(
                                (item) =>
                                    item.value === shadow,
                            )
                                ? shadow
                                : "custom"
                        }
                        onChange={(event) => {
                            const value =
                                event.target.value;

                            if (value !== "custom") {
                                onChange(
                                    "box-shadow",
                                    value,
                                );
                            }
                        }}
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        {shadowPresets.map(
                            (item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ),
                        )}

                        <option value="custom">
                            Custom
                        </option>
                    </select>
                </div>

                {/* Custom Shadow */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        CSS Shadow
                    </label>

                    <input
                        type="text"
                        value={shadow}
                        onChange={(event) =>
                            onChange(
                                "box-shadow",
                                event.target.value,
                            )
                        }
                        placeholder="0 4px 12px rgba(0,0,0,0.15)"
                        className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                    />

                    <p className="mt-1 text-[10px] text-slate-400">
                        Example: 0 4px 12px rgba(0,0,0,0.15)
                    </p>
                </div>
            </div>
        </div>
    );
}