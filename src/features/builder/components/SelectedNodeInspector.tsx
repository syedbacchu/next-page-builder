"use client";

import { componentRegistry } from "@/features/builder/registry/component-registry";
import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { findNodeById } from "@/features/builder/utils/find-node";
import { getStyleValue } from "@/features/builder/types/builder.types";
import { setColumnSpan } from "@/features/builder/utils/set-column-span";

import { SpacingControl } from "@/features/builder/components/SpacingControl";
import { ResponsiveColumnsControl } from "@/features/builder/components/inspector/ResponsiveColumnsControl";
import { DimensionsControl } from "@/features/builder/components/inspector/DimensionsControl";
import { NodeSchemaFields } from "@/features/builder/components/inspector/NodeSchemaFields";
import { TypographyControl } from "@/features/builder/components/inspector/TypographyControl";
import { BackgroundControl } from "@/features/builder/components/inspector/BackgroundControl";
import { BorderControl } from "@/features/builder/components/inspector/BorderControl";
import { ShadowControl } from "@/features/builder/components/inspector/ShadowControl";
import { HoverControl } from "@/features/builder/components/inspector/HoverControl";
import { EffectsControl } from "@/features/builder/components/inspector/EffectsControl";

export function SelectedNodeInspector() {
    const { state, dispatch } = useBuilder();

    /*
     * No node selected
     */
    if (!state.selectedNodeId) {
        return (
            <aside className="w-72 border-l bg-white p-4">
                <p className="text-sm text-gray-500">
                    Select an element
                </p>
            </aside>
        );
    }

    /*
     * Find selected node
     */
    const selectedNode = findNodeById(
        state.document,
        state.selectedNodeId,
    );

    /*
     * Selected node no longer exists
     */
    if (!selectedNode) {
        return (
            <aside className="w-72 border-l bg-white p-4">
                <p className="text-sm text-red-500">
                    Node not found
                </p>
            </aside>
        );
    }

    /*
     * Important:
     *
     * TypeScript does not always preserve null narrowing
     * inside nested functions/closures.
     *
     * Since we already checked selectedNode above,
     * this alias is guaranteed to be non-null.
     */
    const node = selectedNode;

    /*
     * Component definition
     */
    const definition =
        componentRegistry[node.type];

    if (!definition) {
        return null;
    }

    const schema = definition.schema ?? {};

    /*
     * Update node props/styles
     */
    function updateField(
        key: string,
        value: unknown,
        source: "props" | "styles" = "props",
    ) {
        /*
         * Column span
         *
         * Span is responsive, so only the current
         * viewport value will be changed.
         */
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
                nodeId: node.id,
                props: {
                    span,
                },
            });

            return;
        }

        /*
         * Responsive styles
         */
        if (source === "styles") {
            if (typeof value !== "string") {
                return;
            }

            dispatch({
                type: "UPDATE_NODE_STYLES",
                nodeId: node.id,
                viewport: state.viewport,
                key,
                value,
            });

            return;
        }

        /*
         * Normal props
         */
        dispatch({
            type: "UPDATE_NODE_PROPS",
            nodeId: node.id,
            props: {
                [key]: value,
            },
        });
    }

    /*
     * Get spacing values for current viewport
     */
    function getSpacingValues(
        property: "margin" | "padding",
    ) {
        return {
            top:
                getStyleValue(
                    node.styles,
                    `${property}-top`,
                    state.viewport,
                ) ?? "",

            right:
                getStyleValue(
                    node.styles,
                    `${property}-right`,
                    state.viewport,
                ) ?? "",

            bottom:
                getStyleValue(
                    node.styles,
                    `${property}-bottom`,
                    state.viewport,
                ) ?? "",

            left:
                getStyleValue(
                    node.styles,
                    `${property}-left`,
                    state.viewport,
                ) ?? "",
        };
    }

    return (
        <aside className="w-72 border-l bg-white p-4">
            {/* Header */}
            <h2 className="mb-5 text-sm font-semibold capitalize">
                {definition.label}
            </h2>

            <div className="space-y-5">
                {/* Responsive row columns */}
                {node.type === "row" && (
                    <ResponsiveColumnsControl
                        node={node}
                    />
                )}

                {/* Spacing */}
                <div className="rounded-lg border border-slate-200 p-3">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Spacing
                    </h3>

                    <div className="space-y-4">
                        {/* Margin */}
                        <SpacingControl
                            label="Margin"
                            values={getSpacingValues("margin")}
                            onChange={(side, value) =>
                                updateField(
                                    `margin-${side}`,
                                    value,
                                    "styles",
                                )
                            }
                        />

                        {/* Padding */}
                        <SpacingControl
                            label="Padding"
                            values={getSpacingValues("padding")}
                            onChange={(side, value) =>
                                updateField(
                                    `padding-${side}`,
                                    value,
                                    "styles",
                                )
                            }
                        />
                    </div>
                </div>

                {/* Dimensions */}
                <DimensionsControl
                    node={node}
                    viewport={state.viewport}
                    onChange={(key, value) =>
                        updateField(
                            key,
                            value,
                            "styles",
                        )
                    }
                />

                <TypographyControl
                    node={node}
                    viewport={state.viewport}
                    onChange={(key, value) =>
                        updateField(
                            key,
                            value,
                            "styles",
                        )
                    }
                />

                <BackgroundControl
                    node={node}
                    viewport={state.viewport}
                    onChange={(key, value) =>
                        updateField(
                            key,
                            value,
                            "styles",
                        )
                    }
                />
                <BorderControl
                    node={node}
                    viewport={state.viewport}
                    onChange={(key, value) =>
                        updateField(
                            key,
                            value,
                            "styles",
                        )
                    }
                />
                <ShadowControl
                    node={node}
                    viewport={state.viewport}
                    onChange={(key, value) =>
                        updateField(
                            key,
                            value,
                            "styles",
                        )
                    }
                />

                <HoverControl
                    node={node}
                    viewport={state.viewport}
                    onChange={(key, value) =>
                        dispatch({
                            type: "UPDATE_NODE_INTERACTION_STYLES",
                            nodeId: node.id,
                            interaction: "hover",
                            viewport: state.viewport,
                            key,
                            value,
                        })
                    }
                />
                <EffectsControl
                    node={node}
                    viewport={state.viewport}
                    onChange={(key, value) =>
                        updateField(
                            key,
                            value,
                            "styles",
                        )
                    }
                />

                {/* Component schema fields */}
                <NodeSchemaFields
                    node={node}
                    schema={schema}
                    viewport={state.viewport}
                    onChange={updateField}
                />
            </div>

            {/* Debug / Props */}
            <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold">
                    Props
                </h3>

                <pre className="overflow-auto rounded bg-gray-100 p-3 text-xs">
                    {JSON.stringify(
                        node.props,
                        null,
                        2,
                    )}
                </pre>
            </div>
        </aside>
    );
}