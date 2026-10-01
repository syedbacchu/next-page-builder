"use client";

import { componentRegistry } from "@/features/builder/registry/component-registry";
import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { findNodeById } from "@/features/builder/utils/find-node";
import { BuilderField } from "@/features/builder/components/BuilderField";
import {
    getStyleValue,
    isResponsiveStyles,
} from "@/features/builder/types/builder.types";
import { setColumnSpan } from "@/features/builder/utils/set-column-span";
import { getColumnSpan } from "@/features/builder/utils/get-column-span";
import { getColumnsPerRow } from "@/features/builder/utils/get-columns-per-row";

export function SelectedNodeInspector() {
    const { state, dispatch } = useBuilder();

    if (!state.selectedNodeId) {
        return (
            <aside className="w-72 border-l p-4">
                <p className="text-sm text-gray-500">
                    Select an element
                </p>
            </aside>
        );
    }

    const selectedNode = findNodeById(
        state.document,
        state.selectedNodeId,
    );

    if (!selectedNode) {
        return (
            <aside className="w-72 border-l p-4">
                <p className="text-sm text-red-500">
                    Node not found
                </p>
            </aside>
        );
    }
    const selectedNodeId = selectedNode.id;
    const node = selectedNode;
    const definition = componentRegistry[selectedNode.type];

    if (!definition) {
        return null;
    }

    const schema = definition.schema ?? {};
    function updateField(
        key: string,
        value: unknown,
        source: "props" | "styles" = "props",
    ) {
        if (
            source === "props" &&
            node.type === "column" &&
            key === "span"
        ) {
            const span = setColumnSpan(
                node.props.span,
                state.viewport,
                Number(value),
            );

            dispatch({
                type: "UPDATE_NODE_PROPS",
                nodeId: selectedNodeId,
                props: {
                    span,
                },
            });

            return;
        }
        if (source === "styles") {
            if (typeof value !== "string") {
                return;
            }

            const currentStyles =
                findNodeById(
                    state.document,
                    selectedNodeId,
                )?.styles;

            const responsiveStyles =
                currentStyles &&
                isResponsiveStyles(currentStyles)
                    ? currentStyles
                    : {
                        desktop: currentStyles ?? {},
                    };

            dispatch({
                type: "UPDATE_NODE_STYLES",
                nodeId: selectedNodeId,
                styles: {
                    [state.viewport]: {
                        ...(responsiveStyles[state.viewport] ?? {}),
                        [key]: value,
                    },
                },
            });

            return;
        }

        dispatch({
            type: "UPDATE_NODE_PROPS",
            nodeId: selectedNodeId,
            props: {
                [key]: value,
            },
        });
    }

    return (
        <aside className="w-72 border-l bg-white p-4">
            <h2 className="mb-5 text-sm font-semibold capitalize">
                {definition.label}
            </h2>

            <div className="space-y-5">
                {selectedNode.type === "row" && (
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
                            ).map(([viewport, label]) => (
                                <div
                                    key={viewport}
                                    className="flex items-center justify-between gap-2"
                                >
                    <span className="text-xs font-medium text-slate-600">
                        {label}
                    </span>

                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(
                                            (columnsPerRow) => {
                                                const currentColumnsPerRow =
                                                    getColumnsPerRow(
                                                        selectedNode,
                                                        viewport,
                                                    );

                                                const isActive =
                                                    currentColumnsPerRow ===
                                                    columnsPerRow;

                                                return (
                                                    <button
                                                        key={columnsPerRow}
                                                        type="button"
                                                        className={[
                                                            "flex h-7 w-7 items-center justify-center",
                                                            "rounded border text-xs font-medium",
                                                            "transition",
                                                            isActive
                                                                ? "border-blue-500 bg-blue-500 text-white"
                                                                : "border-slate-200 bg-white text-slate-600",
                                                            "hover:border-blue-400",
                                                        ].join(" ")}
                                                        onClick={() => {
                                                            dispatch({
                                                                type: "SET_RESPONSIVE_COLUMN_LAYOUT",
                                                                rowId: selectedNode.id,
                                                                viewport,
                                                                columnsPerRow,
                                                            });
                                                        }}
                                                    >
                                                        {columnsPerRow}
                                                    </button>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {Object.entries(schema).map(([key, field]) => {

                    return (
                        <BuilderField
                            key={key}
                            name={key}
                            field={field}
                            value={
                                field.source === "styles"
                                    ? getStyleValue(
                                        selectedNode.styles,
                                        key,
                                        state.viewport,
                                    ) ??
                                    field.defaultValue ??
                                    ""
                                    : selectedNode.type === "column" &&
                                    key === "span"
                                        ? getColumnSpan(
                                            selectedNode.props.span,
                                            state.viewport,
                                        )
                                        : selectedNode.props[key] ??
                                        field.defaultValue ??
                                        ""
                            }
                            onChange={(nextValue) =>
                                updateField(
                                    key,
                                    nextValue,
                                    field.source ?? "props",
                                )
                            }
                        />
                    );
                })}
            </div>

            <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold">
                    Props
                </h3>

                <pre className="overflow-auto rounded bg-gray-100 p-3 text-xs">
          {JSON.stringify(
              selectedNode.props,
              null,
              2,
          )}
        </pre>
            </div>
        </aside>
    );
}