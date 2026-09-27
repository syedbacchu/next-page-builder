"use client";

import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { componentRegistry } from "@/features/builder/registry/component-registry";
import type { BuilderNode } from "@/features/builder/types/builder.types";

interface BuilderRendererProps {
    node: BuilderNode;
}

export function BuilderRenderer({
    node,
}: BuilderRendererProps) {
    const { state, dispatch } = useBuilder();
    console.log("Rendering node:", node.id);
    console.log("Selected node:", state.selectedNodeId);

    const definition = componentRegistry[node.type];

    if (!definition) {
        return null;
    }

    const Component = definition.component;

    const children = node.children?.map((child) => (
        <BuilderRenderer
            key={child.id}
            node={child}
        />
    ));

    const isSelected =
        state.selectedNodeId === node.id;

    return (
        <div
            onClick={(event) => {
                event.stopPropagation();
                console.log("CLICKED NODE:", node.id);
                dispatch({
                    type: "SELECT_NODE",
                    nodeId: node.id,
                });
            }}
            className={[
                "builder-node-wrapper",
                isSelected ? "builder-node-selected" : "",
                node.type === "section" || node.type === "container"
                    ? "builder-layout-node"
                    : "",
            ].join(" ")}
            style={node.styles}
        >
            <Component {...node.props}>
                {children}
            </Component>
        </div>
    );
}