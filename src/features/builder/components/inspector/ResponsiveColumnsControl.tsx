"use client";

import type { BuilderNode } from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { getColumnsPerRow } from "@/features/builder/utils/get-columns-per-row";

interface Props {
    node: BuilderNode;
}

export function ResponsiveColumnsControl({ node }: Props) {
    const { dispatch } = useBuilder();

    return (
        <div className="rounded-lg border border-slate-200 p-3">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Responsive Columns
            </h3>

            <div className="space-y-3">
                {(
                    [
                        ["desktop", "Desktop"],
                        ["tablet", "Tablet"],
                        ["mobile", "Mobile"],
                    ] as const
                ).map(([viewport, label]) => {
                    const currentColumnsPerRow =
                        getColumnsPerRow(node, viewport);

                    return (
                        <div
                            key={viewport}
                            className="flex items-center justify-between gap-2"
                        >
                            <span className="text-xs font-medium text-slate-600">
                                {label}
                            </span>

                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((columnsPerRow) => (
                                    <button
                                        key={columnsPerRow}
                                        type="button"
                                        className={[
                                            "flex h-7 w-7 items-center justify-center",
                                            "rounded border text-xs font-medium transition",
                                            currentColumnsPerRow ===
                                            columnsPerRow
                                                ? "border-blue-500 bg-blue-500 text-white"
                                                : "border-slate-200 bg-white text-slate-600",
                                            "hover:border-blue-400",
                                        ].join(" ")}
                                        onClick={() => {
                                            dispatch({
                                                type: "SET_RESPONSIVE_COLUMN_LAYOUT",
                                                rowId: node.id,
                                                viewport,
                                                columnsPerRow,
                                            });
                                        }}
                                    >
                                        {columnsPerRow}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}