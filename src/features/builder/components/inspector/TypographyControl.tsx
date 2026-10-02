"use client";

import type { BuilderNode } from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import { getStyleValue } from "@/features/builder/types/builder.types";

interface TypographyControlProps {
    node: BuilderNode;
    viewport: BuilderViewport;
    onChange: (key: string, value: string) => void;
}

const fontWeights = [
    { value: "300", label: "Light" },
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi Bold" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Extra Bold" },
];

const textAlignments = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
    { value: "justify", label: "Justify" },
];

const textTransforms = [
    { value: "none", label: "None" },
    { value: "uppercase", label: "Uppercase" },
    { value: "lowercase", label: "Lowercase" },
    { value: "capitalize", label: "Capitalize" },
];

const textDecorations = [
    { value: "none", label: "None" },
    { value: "underline", label: "Underline" },
    { value: "line-through", label: "Line Through" },
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

export function TypographyControl({
                                      node,
                                      viewport,
                                      onChange,
                                  }: TypographyControlProps) {
    return (
        <div className="rounded-lg border border-slate-200 p-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Typography
            </h3>

            <div className="space-y-4">
                {/* Font Family */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Font Family
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "font-family",
                            "inherit",
                        )}
                        onChange={(event) =>
                            onChange(
                                "font-family",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        <option value="inherit">
                            Default
                        </option>

                        <option value="Arial, sans-serif">
                            Arial
                        </option>

                        <option value="Helvetica, sans-serif">
                            Helvetica
                        </option>

                        <option value="Georgia, serif">
                            Georgia
                        </option>

                        <option value="Times New Roman, serif">
                            Times New Roman
                        </option>

                        <option value="Verdana, sans-serif">
                            Verdana
                        </option>

                        <option value="Tahoma, sans-serif">
                            Tahoma
                        </option>

                        <option value="Trebuchet MS, sans-serif">
                            Trebuchet MS
                        </option>

                        <option value="monospace">
                            Monospace
                        </option>
                    </select>
                </div>

                {/* Font Size + Line Height */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                            Font Size
                        </label>

                        <input
                            type="text"
                            value={getValue(
                                node,
                                viewport,
                                "font-size",
                            )}
                            onChange={(event) =>
                                onChange(
                                    "font-size",
                                    event.target.value,
                                )
                            }
                            placeholder="16px"
                            className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                            Line Height
                        </label>

                        <input
                            type="text"
                            value={getValue(
                                node,
                                viewport,
                                "line-height",
                            )}
                            onChange={(event) =>
                                onChange(
                                    "line-height",
                                    event.target.value,
                                )
                            }
                            placeholder="1.5"
                            className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Font Weight */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Font Weight
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "font-weight",
                            "400",
                        )}
                        onChange={(event) =>
                            onChange(
                                "font-weight",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        {fontWeights.map((weight) => (
                            <option
                                key={weight.value}
                                value={weight.value}
                            >
                                {weight.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Letter Spacing */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Letter Spacing
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            node,
                            viewport,
                            "letter-spacing",
                        )}
                        onChange={(event) =>
                            onChange(
                                "letter-spacing",
                                event.target.value,
                            )
                        }
                        placeholder="0px"
                        className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                    />
                </div>

                {/* Text Alignment */}
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                        Text Align
                    </label>

                    <div className="grid grid-cols-4 gap-1">
                        {textAlignments.map((alignment) => {
                            const current = getValue(
                                node,
                                viewport,
                                "text-align",
                                "left",
                            );

                            const active =
                                current === alignment.value;

                            return (
                                <button
                                    key={alignment.value}
                                    type="button"
                                    onClick={() =>
                                        onChange(
                                            "text-align",
                                            alignment.value,
                                        )
                                    }
                                    className={[
                                        "h-8 rounded border text-[10px] font-medium",
                                        active
                                            ? "border-blue-500 bg-blue-500 text-white"
                                            : "border-slate-200 bg-white text-slate-600",
                                    ].join(" ")}
                                >
                                    {alignment.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Text Transform */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Text Transform
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "text-transform",
                            "none",
                        )}
                        onChange={(event) =>
                            onChange(
                                "text-transform",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        {textTransforms.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Text Decoration */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Text Decoration
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "text-decoration",
                            "none",
                        )}
                        onChange={(event) =>
                            onChange(
                                "text-decoration",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        {textDecorations.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}