"use client";

import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { componentRegistry } from "@/features/builder/registry/component-registry";
import type { BuilderNode } from "@/features/builder/types/builder.types";
import { BuilderNodeToolbar } from "@/features/builder/components/BuilderNodeToolbar";
import { BuilderDropIndicator } from "@/features/builder/components/BuilderDropIndicator";
import { findNodeById } from "@/features/builder/utils/find-node";
import {createBuilderNode} from "@/features/builder/utils/create-node";


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
    const isDropTarget =
        state.drag.dropPosition?.targetNodeId === node.id;
    const isDragging =
        state.drag.activeNodeId === node.id;
    const activeNodeId = state.drag.activeNodeId;

    const activeNode = activeNodeId
        ? findNodeById(state.document, activeNodeId)
        : null;

    const isInvalidDropTarget =
        activeNodeId !== null &&
        activeNode !== null &&
        (
            activeNode.id === node.id ||
            findNodeById(activeNode, node.id) !== null
        );

    return (
        <div
            draggable
            onDragStart={(event) => {
                event.stopPropagation();

                event.dataTransfer.setData(
                    "application/x-builder-node",
                    node.id,
                );

                dispatch({
                    type: "DRAG_START",
                    nodeId: node.id,
                });

                event.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(event) => {
                event.preventDefault();
                event.stopPropagation();

                const dragType = event.dataTransfer.types;

                const isNewComponentDrag = dragType.includes(
                    "application/x-builder-component",
                );

                if (isNewComponentDrag) {
                    event.dataTransfer.dropEffect = "copy";
                } else {
                    event.dataTransfer.dropEffect = "move";
                }

                const activeNodeId = state.drag.activeNodeId;

                if (activeNodeId) {
                    const activeNode = findNodeById(
                        state.document,
                        activeNodeId,
                    );

                    if (
                        activeNode &&
                        (node.id === activeNode.id ||
                            findNodeById(activeNode, node.id))
                    ) {
                        event.dataTransfer.dropEffect = "none";
                        return;
                    }
                }
                const rect = event.currentTarget.getBoundingClientRect();
                const offsetY = event.clientY - rect.top;
                const ratio = rect.height > 0 ? offsetY / rect.height : 0.5;


                if (
                    node.type === "section" ||
                    node.type === "container"
                ) {
                    if (ratio > 0.25 && ratio < 0.75) {
                        dispatch({
                            type: "SET_DROP_POSITION",
                            position: {
                                type: "inside",
                                targetNodeId: node.id,
                            },
                        });

                        return;
                    }
                }

                dispatch({
                    type: "SET_DROP_POSITION",
                    position: {
                        type: ratio < 0.5 ? "before" : "after",
                        targetNodeId: node.id,
                    },
                });
            }}
            onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();

                const componentType = event.dataTransfer.getData(
                    "application/x-builder-component",
                );

                if (componentType) {
                    const newNode = createBuilderNode(
                        componentType as BuilderNode["type"],
                    );

                    dispatch({
                        type: "ADD_NODE",
                        parentId: node.id,
                        node: newNode,
                    });

                    return;
                }

                if (state.drag.activeNodeId === node.id) {
                    return;
                }

                dispatch({
                    type: "DROP_NODE",
                });
            }}
            onDragEnd={(event) => {
                event.stopPropagation();

                dispatch({
                    type: "DRAG_END",
                });
            }}
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
                isDragging ? "builder-node-dragging" : "",
                isInvalidDropTarget ? "builder-node-drop-invalid" : "",
                node.type === "section" || node.type === "container"
                    ? "builder-layout-node"
                    : "",
            ].join(" ")}
            style={node.styles}
        >
            {isSelected && <BuilderNodeToolbar />}

            {isDropTarget && <BuilderDropIndicator />}
            <Component {...node.props}>
                {children}
            </Component>
        </div>
    );
}