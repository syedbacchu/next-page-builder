"use client";

import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { componentRegistry } from "@/features/builder/registry/component-registry";
import type { BuilderNode } from "@/features/builder/types/builder.types";
import { BuilderNodeToolbar } from "@/features/builder/components/BuilderNodeToolbar";
import { BuilderDropIndicator } from "@/features/builder/components/BuilderDropIndicator";
import { findNodeById } from "@/features/builder/utils/find-node";
import {createBuilderNode} from "@/features/builder/utils/create-node";
import { canDropNode } from "@/features/builder/utils/can-drop-node";
import {DropPosition} from "@/features/builder/types/drop-position.types";
import { canDropNewComponent } from "@/features/builder/utils/can-drop-new-component";
import {getNodeStyles} from "@/features/builder/utils/get-node-styles";

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

    const isDragging =
        state.drag.activeNodeId === node.id;

    const isDropTarget =
        state.drag.dropPosition?.targetNodeId === node.id;

    const isInvalidDropTarget =
        isDropTarget &&
        state.drag.activeNodeId !== null &&
        state.drag.dropPosition !== null &&
        !canDropNode(
            state.document,
            state.drag.activeNodeId,
            state.drag.dropPosition,
        );

    const isLayoutNode =
        node.type === "section" ||
        node.type === "container";

    const isEmptyLayoutNode =
        isLayoutNode &&
        node.children.length === 0;

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

                const activeNodeId = state.drag.activeNodeId;

                event.dataTransfer.dropEffect =
                    isNewComponentDrag ? "copy" : "move";

                const rect =
                    event.currentTarget.getBoundingClientRect();

                const offsetY = event.clientY - rect.top;

                const ratio =
                    rect.height > 0
                        ? offsetY / rect.height
                        : 0.5;

                const definition =
                    componentRegistry[node.type];

                const position: DropPosition = isNewComponentDrag
                    ? {
                        type: "inside",
                        targetNodeId: node.id,
                    }
                    : definition.canHaveChildren &&
                    ratio > 0.25 &&
                    ratio < 0.75
                        ? {
                            type: "inside",
                            targetNodeId: node.id,
                        }
                        : {
                            type:
                                ratio < 0.5
                                    ? "before"
                                    : "after",
                            targetNodeId: node.id,
                        };

                if (isNewComponentDrag) {
                    const componentType = event.dataTransfer.getData(
                        "application/x-builder-component",
                    ) as BuilderNode["type"];

                    if (
                        !canDropNewComponent(
                            componentType,
                            node.type,
                        )
                    ) {
                        event.dataTransfer.dropEffect = "none";
                        return;
                    }
                }
                // Existing node drag validation
                if (!isNewComponentDrag && activeNodeId) {
                    if (
                        !canDropNode(
                            state.document,
                            activeNodeId,
                            position,
                        )
                    ) {
                        event.dataTransfer.dropEffect =
                            "none";

                        return;
                    }
                }

                dispatch({
                    type: "SET_DROP_POSITION",
                    position,
                });
            }}

            onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();

                const componentType = event.dataTransfer.getData(
                    "application/x-builder-component",
                );

                // New component from Sidebar
                if (componentType) {
                    if (
                        !canDropNewComponent(
                            componentType as BuilderNode["type"],
                            node.type,
                        )
                    ) {
                        return;
                    }

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

                // Existing builder node
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

                dispatch({
                    type: "SELECT_NODE",
                    nodeId: node.id,
                });

                if (
                    node.type === "section" ||
                    node.type === "container"
                ) {
                    dispatch({
                        type: "SET_INSERT_TARGET",
                        nodeId: node.id,
                    });
                }
            }}
            className={[
                "builder-node-wrapper group relative",
                isSelected ? "builder-node-selected" : "",
                isDragging ? "builder-node-dragging" : "",
                isInvalidDropTarget
                    ? "builder-node-drop-invalid"
                    : "",
                node.type === "section" ||
                node.type === "container"
                    ? "builder-layout-node"
                    : "",
            ].join(" ")}
            style={getNodeStyles(node.styles, state.viewport)}
        >
            {isSelected && <BuilderNodeToolbar />}

            {(node.type === "section" ||
                node.type === "container") && (
                <div
                    className={[
                        "pointer-events-none absolute left-2 top-2 z-[9997]",
                        "flex items-center gap-1",
                        "rounded-md border border-slate-200",
                        "bg-white/95 px-2 py-1",
                        "text-[9px] font-bold uppercase tracking-wider",
                        "text-slate-500",
                        "shadow-sm backdrop-blur-sm",
                        "transition-opacity duration-150",
                        isSelected
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100",
                    ].join(" ")}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {node.type}
                </div>
            )}

            {isDropTarget && !isInvalidDropTarget && (
                <BuilderDropIndicator />
            )}

            <Component {...node.props}>
                {isEmptyLayoutNode ? (
                    <div
                        className="flex min-h-[100px] items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-slate-50/50 p-6"
                        onClick={(event) => {
                            event.stopPropagation();

                            dispatch({
                                type: "SET_INSERT_TARGET",
                                nodeId: node.id,
                            });
                        }}
                    >
                        <div className="text-center">
                            <div
                                className={[
                                    "mx-auto mb-3 flex h-10 w-10 items-center justify-center",
                                    "rounded-full border border-dashed border-slate-300",
                                    "bg-white text-xl text-slate-400",
                                    "transition",
                                    "group-hover:border-blue-400",
                                    "group-hover:bg-blue-50",
                                    "group-hover:text-blue-500",
                                ].join(" ")}
                            >
                                +
                            </div>

                            <p className="text-sm font-semibold text-slate-600">
                                Add Element
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Drag an element here or select one from the sidebar
                            </p>
                        </div>
                    </div>
                ) : (
                    children
                )}
            </Component>
        </div>
    );
}