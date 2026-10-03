"use client";

import type { BuilderNode } from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import { getStyleValue } from "@/features/builder/types/builder.types";

interface BorderControlProps {
    node: BuilderNode;
    viewport: BuilderViewport;
    onChange: (key: string, value: string) => void;
}

const borderStyles = [
    { value: "none", label: "None" },
    { value: "solid", label: "Solid" },
    { value: "dashed", label: "Dashed" },
    { value: "dotted", label: "Dotted" },
    { value: "double", label: "Double" },
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

export function BorderControl({
                                  node,
                                  viewport,
                                  onChange,
                              }: BorderControlProps) {
    return (
        <div className="rounded-lg border border-slate-200 p-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Border
            </h3>

            <div className="space-y-4">
                {/* Border Width */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Width
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            node,
                            viewport,
                            "border-width",
                            "0px",
                        )}
                        onChange={(event) =>
                            onChange(
                                "border-width",
                                event.target.value,
                            )
                        }
                        placeholder="0px"
                        className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                    />
                </div>

                {/* Border Style */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Style
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "border-style",
                            "none",
                        )}
                        onChange={(event) =>
                            onChange(
                                "border-style",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        {borderStyles.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Border Color */}
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                        Color
                    </label>

                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={getValue(
                                node,
                                viewport,
                                "border-color",
                                "#000000",
                            )}
                            onChange={(event) =>
                                onChange(
                                    "border-color",
                                    event.target.value,
                                )
                            }
                            className="h-9 w-10 cursor-pointer rounded border border-slate-200 bg-white p-1"
                        />

                        <input
                            type="text"
                            value={getValue(
                                node,
                                viewport,
                                "border-color",
                            )}
                            onChange={(event) =>
                                onChange(
                                    "border-color",
                                    event.target.value,
                                )
                            }
                            placeholder="#000000"
                            className="h-9 min-w-0 flex-1 rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Border Radius */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Radius
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            node,
                            viewport,
                            "border-radius",
                            "0px",
                        )}
                        onChange={(event) =>
                            onChange(
                                "border-radius",
                                event.target.value,
                            )
                        }
                        placeholder="0px"
                        className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}