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
import { getColumnSpan } from "@/features/builder/utils/get-column-span";
import { getHoverStyles } from "@/features/builder/utils/get-hover-styles";
import {
    getStyleValue,
} from "@/features/builder/types/builder.types";
import type { DropPosition } from "@/features/builder/types/drop-position.types";
import { BuilderColumnDropZone } from "@/features/builder/components/BuilderColumnDropZone";

interface BuilderRendererProps {
    node: BuilderNode;
}

export function BuilderRenderer({
    node,
}: BuilderRendererProps) {
    const { state, dispatch } = useBuilder();

    const {
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
        handleColumnDragOver
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

    const isColumn =
        node.type === "column";

    const isEmptyColumn =
        isColumn &&
        node.children.length === 0;

    const hoverStyles = getHoverStyles(
        node,
        state.viewport,
    );
    const translateX =
        getStyleValue(
            node.styles,
            "--translate-x",
            state.viewport,
        ) ?? "0px";

    const translateY =
        getStyleValue(
            node.styles,
            "--translate-y",
            state.viewport,
        ) ?? "0px";

    const rotate =
        getStyleValue(
            node.styles,
            "--rotate",
            state.viewport,
        ) ?? "0deg";

    const transform =
        getStyleValue(
            node.styles,
            "transform",
            state.viewport,
        );

    const finalTransform =
        transform ||
        `translate(${translateX}, ${translateY}) rotate(${rotate})`;

    const hoverCss = Object.entries(hoverStyles)
        .map(
            ([property, value]) =>
                `${property}: ${value} !important;`,
        )
        .join("\n");

    return (
        <>
            {hoverCss && (
                <style>
                    {`
                    .builder-node-${node.id}:hover {
                        ${hoverCss}
                    }
                `}
                </style>
            )}
        <BuilderNodeWrapper
            nodeId={node.id}
            nodeType={node.type}
            isSelected={isSelected}
            className={`builder-node-${node.id}`}
            style={{
                ...getNodeStyles(
                    node.styles,
                    state.viewport,
                ),

                transform:
                    finalTransform !==
                    "translate(0px, 0px) rotate(0deg)"
                        ? finalTransform
                        : undefined,

                ...(node.interactions?.styles?.hover
                    ? {
                        transitionDuration:
                            node.interactions.styles.hover[
                                state.viewport
                                ]?.["transition-duration"] ??
                            node.interactions.styles.hover.desktop?.[
                                "transition-duration"
                                ],

                        transitionTimingFunction:
                            node.interactions.styles.hover[
                                state.viewport
                                ]?.["transition-timing-function"] ??
                            node.interactions.styles.hover.desktop?.[
                                "transition-timing-function"
                                ],
                    }
                    : {}),

                ...(node.type === "column"
                    ? {
                        gridColumn: `span ${getColumnSpan(
                            node.props.span,
                            state.viewport,
                        )} / span ${getColumnSpan(
                            node.props.span,
                            state.viewport,
                        )}`,
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
                {node.type === "column" && node.children.length === 0 ? (
                    <BuilderColumnDropZone
                        columnId={node.id}
                        onDragOver={handleColumnDragOver}
                        onDrop={handleDrop}
                    />

                ) : null}

                {children}

                {node.type === "column" && node.children.length > 0 ? (
                    <BuilderColumnDropZone
                        columnId={node.id}
                        onDragOver={handleColumnDragOver}
                        onDrop={handleDrop}
                    />
                ) : null}
            </Component>
        </BuilderNodeWrapper>
            </>
    );
}