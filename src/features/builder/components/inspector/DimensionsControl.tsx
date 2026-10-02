"use client";

import type { BuilderNode } from "@/features/builder/types/builder.types";
import { getStyleValue } from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";

interface Props {
    node: BuilderNode;
    viewport: BuilderViewport;
    onChange: (key: string, value: string) => void;
}

export function DimensionsControl({
                                      node,
                                      viewport,
                                      onChange,
                                  }: Props) {
    return (
        <div className="rounded-lg border border-slate-200 p-3">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Dimensions
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {[
                    ["Width", "width"],
                    ["Height", "height"],
                ].map(([label, key]) => (
                    <div key={key}>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                            {label}
                        </label>

                        <input
                            type="text"
                            value={
                                getStyleValue(
                                    node.styles,
                                    key,
                                    viewport,
                                ) ?? ""
                            }
                            onChange={(event) =>
                                onChange(
                                    key,
                                    event.target.value,
                                )
                            }
                            placeholder="auto"
                            className="h-8 w-full rounded border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}