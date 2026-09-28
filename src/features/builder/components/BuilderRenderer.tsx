"use client";

import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { componentRegistry } from "@/features/builder/registry/component-registry";
import type { BuilderNode } from "@/features/builder/types/builder.types";
import { BuilderNodeToolbar } from "@/features/builder/components/BuilderNodeToolbar";

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

    console.log(
        "NODE:",
        node.id,
        node.type,
        "CHILDREN:",
        node.children.map((child) => ({
            id: child.id,
            type: child.type,
        })),
    );

    const isSelected =
        state.selectedNodeId === node.id;

    return (
        <div
            onClick={(event) => {
                event.stopPropagation();

                console.log(
                    "NODE CLICK:",
                    node.id,
                    node.type,
                );

                dispatch({
                    type: "SELECT_NODE",
                    nodeId: node.id,
                });

                if (
                    node.type === "section" ||
                    node.type === "container"
                ) {
                    console.log(
                        "UPDATE INSERT TARGET:",
                        node.id,
                    );

                    dispatch({
                        type: "SET_INSERT_TARGET",
                        nodeId: node.id,
                    });
                }
            }}
            className={[
                "builder-node-wrapper relative",
                isSelected ? "builder-node-selected" : "",
                node.type === "section" || node.type === "container"
                    ? "builder-layout-node"
                    : "",
            ].join(" ")}
            style={node.styles}
        >
            {isSelected && <BuilderNodeToolbar />}
            <Component {...node.props}>
                {children}
            </Component>
        </div>
    );
}