"use client";

import type { BuilderNode } from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";

import {
    getResponsiveInteractionStyle,
} from "@/features/builder/utils/get-responsive-interaction-style";

interface HoverControlProps {
    node: BuilderNode;
    viewport: BuilderViewport;
    onChange: (key: string, value: string) => void;
}

function getValue(
    node: BuilderNode,
    viewport: BuilderViewport,
    key: string,
) {
    return (
        getResponsiveInteractionStyle(
            node.interactions?.styles,
            "hover",
            viewport,
            key,
        ) ?? ""
    );
}

export function HoverControl({
                                 node,
                                 viewport,
                                 onChange,
                             }: HoverControlProps) {
    return (
        <div className="rounded-lg border border-slate-200 p-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hover
            </h3>

            <div className="space-y-4">
                {/* Text Color */}
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                        Text Color
                    </label>

                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={
                                getValue(
                                    node,
                                    viewport,
                                    "color",
                                ) || "#000000"
                            }
                            onChange={(event) =>
                                onChange(
                                    "color",
                                    event.target.value,
                                )
                            }
                            className="h-9 w-10 cursor-pointer rounded border border-slate-200 p-1"
                        />

                        <input
                            type="text"
                            value={getValue(
                                node,
                                viewport,
                                "color",
                            )}
                            onChange={(event) =>
                                onChange(
                                    "color",
                                    event.target.value,
                                )
                            }
                            placeholder="#000000"
                            className="h-9 min-w-0 flex-1 rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Background Color */}
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                        Background Color
                    </label>

                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={
                                getValue(
                                    node,
                                    viewport,
                                    "background-color",
                                ) || "#ffffff"
                            }
                            onChange={(event) =>
                                onChange(
                                    "background-color",
                                    event.target.value,
                                )
                            }
                            className="h-9 w-10 cursor-pointer rounded border border-slate-200 p-1"
                        />

                        <input
                            type="text"
                            value={getValue(
                                node,
                                viewport,
                                "background-color",
                            )}
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

                {/* Border Color */}
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                        Border Color
                    </label>

                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={
                                getValue(
                                    node,
                                    viewport,
                                    "border-color",
                                ) || "#000000"
                            }
                            onChange={(event) =>
                                onChange(
                                    "border-color",
                                    event.target.value,
                                )
                            }
                            className="h-9 w-10 cursor-pointer rounded border border-slate-200 p-1"
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
                        Border Radius
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            node,
                            viewport,
                            "border-radius",
                        )}
                        onChange={(event) =>
                            onChange(
                                "border-radius",
                                event.target.value,
                            )
                        }
                        placeholder="8px"
                        className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                    />
                </div>

                {/* Box Shadow */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Box Shadow
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            node,
                            viewport,
                            "box-shadow",
                        )}
                        onChange={(event) =>
                            onChange(
                                "box-shadow",
                                event.target.value,
                            )
                        }
                        placeholder="0 4px 12px rgba(0,0,0,.15)"
                        className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                    />
                </div>

                {/* Transition */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Transition Duration
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            node,
                            viewport,
                            "transition-duration",
                        )}
                        onChange={(event) =>
                            onChange(
                                "transition-duration",
                                event.target.value,
                            )
                        }
                        placeholder="300ms"
                        className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                    />
                </div>

                {/* Transition Timing */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Transition Timing
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "transition-timing-function",
                        )}
                        onChange={(event) =>
                            onChange(
                                "transition-timing-function",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        <option value="">
                            Default
                        </option>

                        <option value="ease">
                            Ease
                        </option>

                        <option value="linear">
                            Linear
                        </option>

                        <option value="ease-in">
                            Ease In
                        </option>

                        <option value="ease-out">
                            Ease Out
                        </option>

                        <option value="ease-in-out">
                            Ease In Out
                        </option>
                    </select>
                </div>
            </div>
        </div>
    );
}