"use client";

import { componentRegistry } from "@/features/builder/registry/component-registry";
import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { findNodeById } from "@/features/builder/utils/find-node";
import { BuilderField } from "@/features/builder/components/BuilderField";
import {
    getStyleValue,
    isResponsiveStyles,
} from "@/features/builder/types/builder.types";

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