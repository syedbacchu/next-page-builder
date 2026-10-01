"use client";

import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { componentRegistry } from "@/features/builder/registry/component-registry";
import type { BuilderNode } from "@/features/builder/types/builder.types";
import { BuilderNodeToolbar } from "@/features/builder/components/BuilderNodeToolbar";
import { BuilderDropIndicator } from "@/features/builder/components/BuilderDropIndicator";
import { canDropNode } from "@/features/builder/utils/can-drop-node";
import {getNodeStyles} from "@/features/builder/utils/get-node-styles";
import { BuilderColumnResizeHandle } from "@/features/builder/components/BuilderColumnResizeHandle";
import { BuilderNodeWrapper } from "@/features/builder/components/BuilderNodeWrapper";
import {useBuilderDragDrop} from "@/features/builder/hooks/use-builder-drag-drop";
import { useBuilderNodeSelection } from "@/features/builder/hooks/use-builder-node-selection";
import { useBuilderColumnResize } from "@/features/builder/hooks/use-builder-column-resize";
import { findParentNode } from "@/features/builder/utils/find-parent-node";

interface BuilderRendererProps {
    node: BuilderNode;
}

export function BuilderRenderer({
    node,
}: BuilderRendererProps) {
    const { state, dispatch } = useBuilder();
    console.log("Rendering node:", node.id);
    console.log("Selected node:", state.selectedNodeId);
    const {
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    } = useBuilderDragDrop({ node });

    const {
        handleNodeClick,
    } = useBuilderNodeSelection({ node });

    const {
        handleResizeStart,
        handleResizeMove,
        handleResizeEnd,
    } = useBuilderColumnResize({ node });

    const parentNode = findParentNode(
        state.document,
        node.id,
    );

    const columnSiblings =
        parentNode?.type === "row"
            ? parentNode.children.filter(
                (child) => child.type === "column",
            )
            : [];

    const columnIndex = columnSiblings.findIndex(
        (child) => child.id === node.id,
    );

    const isResizableColumn =
        node.type === "column" &&
        columnIndex !== -1 &&
        columnIndex < columnSiblings.length - 1;

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
        (node.type === "section" ||
            node.type === "container" ||
            node.type === "column") &&
        node.children.length === 0;

    const isEmptyLayoutNode =
        isLayoutNode &&
        node.children.length === 0;

    return (
        <BuilderNodeWrapper
            nodeId={node.id}
            nodeType={node.type}
            isSelected={isSelected}
            style={{
                ...getNodeStyles(
                    node.styles,
                    state.viewport,
                ),

                ...(node.type === "column"
                    ? {
                        gridColumn: `span ${
                            Math.min(
                                12,
                                Math.max(
                                    1,
                                    Number(
                                        node.props.span ?? 12,
                                    ),
                                ),
                            )
                        } / span ${
                            Math.min(
                                12,
                                Math.max(
                                    1,
                                    Number(
                                        node.props.span ?? 12,
                                    ),
                                ),
                            )
                        }`,
                    }
                    : {}),
            }}

            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onClick={handleNodeClick}


        >
            {isSelected && <BuilderNodeToolbar />}

            {isResizableColumn && (
                <BuilderColumnResizeHandle
                    onResizeStart={handleResizeStart}
                    onResizeEnd={handleResizeEnd}
                    onResizeMove={handleResizeMove}
                />
            )}

            {(node.type === "section" ||
                node.type === "container" ||
                node.type === "row" ||
                node.type === "column") && (
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
                                type: "SELECT_NODE",
                                nodeId: node.id,
                            });

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
        </BuilderNodeWrapper>
    );
}