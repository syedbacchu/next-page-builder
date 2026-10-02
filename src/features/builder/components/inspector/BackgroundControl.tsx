"use client";

import type { BuilderNode } from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import { getStyleValue } from "@/features/builder/types/builder.types";

interface BackgroundControlProps {
    node: BuilderNode;
    viewport: BuilderViewport;
    onChange: (key: string, value: string) => void;
}

const backgroundSizes = [
    { value: "auto", label: "Auto" },
    { value: "cover", label: "Cover" },
    { value: "contain", label: "Contain" },
];

const backgroundPositions = [
    { value: "center center", label: "Center" },
    { value: "top center", label: "Top" },
    { value: "bottom center", label: "Bottom" },
    { value: "left center", label: "Left" },
    { value: "right center", label: "Right" },
];

const backgroundRepeats = [
    { value: "no-repeat", label: "No Repeat" },
    { value: "repeat", label: "Repeat" },
    { value: "repeat-x", label: "Repeat X" },
    { value: "repeat-y", label: "Repeat Y" },
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

export function BackgroundControl({
                                      node,
                                      viewport,
                                      onChange,
                                  }: BackgroundControlProps) {
    const backgroundColor = getValue(
        node,
        viewport,
        "background-color",
        "",
    );

    const backgroundImage = getValue(
        node,
        viewport,
        "background-image",
        "",
    );

    return (
        <div className="rounded-lg border border-slate-200 p-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Background
            </h3>

            <div className="space-y-4">
                {/* Background Color */}
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                        Background Color
                    </label>

                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={
                                backgroundColor ||
                                "#ffffff"
                            }
                            onChange={(event) =>
                                onChange(
                                    "background-color",
                                    event.target.value,
                                )
                            }
                            className="h-9 w-10 cursor-pointer rounded border border-slate-200 bg-white p-1"
                        />

                        <input
                            type="text"
                            value={backgroundColor}
                            onChange={(event) =>
                                onChange(
                                    "background-color",
                                    event.target.value,
                                )
                            }
                            placeholder="#ffffff"
                            className="h-9 min-w-0 flex-1 rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Background Image */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Background Image
                    </label>

                    <input
                        type="text"
                        value={backgroundImage}
                        onChange={(event) =>
                            onChange(
                                "background-image",
                                event.target.value,
                            )
                        }
                        placeholder="https://example.com/image.jpg"
                        className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                    />

                    <p className="mt-1 text-[10px] text-slate-400">
                        Enter image URL
                    </p>
                </div>

                {/* Background Size */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Size
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "background-size",
                            "cover",
                        )}
                        onChange={(event) =>
                            onChange(
                                "background-size",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        {backgroundSizes.map(
                            (item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ),
                        )}
                    </select>
                </div>

                {/* Background Position */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Position
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "background-position",
                            "center center",
                        )}
                        onChange={(event) =>
                            onChange(
                                "background-position",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        {backgroundPositions.map(
                            (item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ),
                        )}
                    </select>
                </div>

                {/* Background Repeat */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Repeat
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "background-repeat",
                            "no-repeat",
                        )}
                        onChange={(event) =>
                            onChange(
                                "background-repeat",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        {backgroundRepeats.map(
                            (item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ),
                        )}
                    </select>
                </div>

                {/* Background Attachment */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Attachment
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "background-attachment",
                            "scroll",
                        )}
                        onChange={(event) =>
                            onChange(
                                "background-attachment",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        <option value="scroll">
                            Scroll
                        </option>

                        <option value="fixed">
                            Fixed
                        </option>

                        <option value="local">
                            Local
                        </option>
                    </select>
                </div>
            </div>
        </div>
    );
}