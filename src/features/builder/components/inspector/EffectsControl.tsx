"use client";

import type { BuilderNode } from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import { getStyleValue } from "@/features/builder/types/builder.types";

interface EffectsControlProps {
    node: BuilderNode;
    viewport: BuilderViewport;
    onChange: (key: string, value: string) => void;
}

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

export function EffectsControl({
                                   node,
                                   viewport,
                                   onChange,
                               }: EffectsControlProps) {
    return (
        <div className="rounded-lg border border-slate-200 p-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Effects
            </h3>

            <div className="space-y-4">
                {/* Opacity */}
                <div>
                    <div className="mb-1 flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-600">
                            Opacity
                        </label>

                        <span className="text-[10px] text-slate-400">
                            {getValue(
                                node,
                                viewport,
                                "opacity",
                                "1",
                            )}
                        </span>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={getValue(
                            node,
                            viewport,
                            "opacity",
                            "1",
                        )}
                        onChange={(event) =>
                            onChange(
                                "opacity",
                                event.target.value,
                            )
                        }
                        className="w-full"
                    />
                </div>

                {/* Transform */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Transform
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            node,
                            viewport,
                            "transform",
                        )}
                        onChange={(event) =>
                            onChange(
                                "transform",
                                event.target.value,
                            )
                        }
                        placeholder="scale(1.05)"
                        className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                    />

                    <p className="mt-1 text-[10px] text-slate-400">
                        Example: scale(1.05)
                    </p>
                </div>

                {/* Translate X / Y */}
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                        Translate
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            value={getValue(
                                node,
                                viewport,
                                "--translate-x",
                            )}
                            onChange={(event) =>
                                onChange(
                                    "--translate-x",
                                    event.target.value,
                                )
                            }
                            placeholder="0px"
                            className="h-9 rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                        />

                        <input
                            type="text"
                            value={getValue(
                                node,
                                viewport,
                                "--translate-y",
                            )}
                            onChange={(event) =>
                                onChange(
                                    "--translate-y",
                                    event.target.value,
                                )
                            }
                            placeholder="0px"
                            className="h-9 rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Rotate */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Rotate
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            node,
                            viewport,
                            "--rotate",
                        )}
                        onChange={(event) =>
                            onChange(
                                "--rotate",
                                event.target.value,
                            )
                        }
                        placeholder="0deg"
                        className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                    />
                </div>

                {/* Transition */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Transition
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            node,
                            viewport,
                            "transition",
                        )}
                        onChange={(event) =>
                            onChange(
                                "transition",
                                event.target.value,
                            )
                        }
                        placeholder="all 300ms ease"
                        className="h-9 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                    />
                </div>

                {/* Cursor */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Cursor
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "cursor",
                            "default",
                        )}
                        onChange={(event) =>
                            onChange(
                                "cursor",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        <option value="default">
                            Default
                        </option>

                        <option value="pointer">
                            Pointer
                        </option>

                        <option value="text">
                            Text
                        </option>

                        <option value="move">
                            Move
                        </option>

                        <option value="grab">
                            Grab
                        </option>

                        <option value="not-allowed">
                            Not Allowed
                        </option>
                    </select>
                </div>

                {/* Overflow */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Overflow
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "overflow",
                            "visible",
                        )}
                        onChange={(event) =>
                            onChange(
                                "overflow",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        <option value="visible">
                            Visible
                        </option>

                        <option value="hidden">
                            Hidden
                        </option>

                        <option value="auto">
                            Auto
                        </option>

                        <option value="scroll">
                            Scroll
                        </option>
                    </select>
                </div>

                {/* Visibility */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Visibility
                    </label>

                    <select
                        value={getValue(
                            node,
                            viewport,
                            "visibility",
                            "visible",
                        )}
                        onChange={(event) =>
                            onChange(
                                "visibility",
                                event.target.value,
                            )
                        }
                        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
                    >
                        <option value="visible">
                            Visible
                        </option>

                        <option value="hidden">
                            Hidden
                        </option>

                        <option value="collapse">
                            Collapse
                        </option>
                    </select>
                </div>
            </div>
        </div>
    );
}