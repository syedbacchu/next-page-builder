"use client";

import type {
    CSSProperties,
    DragEvent,
    MouseEvent,
    ReactNode,
} from "react";

interface BuilderNodeWrapperProps {
    nodeId: string;
    nodeType: string;
    isSelected: boolean;
    children: ReactNode;
    style?: CSSProperties;
    className?: string;

    onClick: (
        event: MouseEvent<HTMLDivElement>,
    ) => void;

    onDragStart: (
        event: DragEvent<HTMLDivElement>,
    ) => void;

    onDragOver: (
        event: DragEvent<HTMLDivElement>,
    ) => void;

    onDrop: (
        event: DragEvent<HTMLDivElement>,
    ) => void;

    onDragEnd: (
        event: DragEvent<HTMLDivElement>,
    ) => void;
}

export function BuilderNodeWrapper({
                                       nodeId,
                                       nodeType,
                                       isSelected,
                                       children,
                                       style,
                                       className = "",
                                       onClick,
                                       onDragStart,
                                       onDragOver,
                                       onDrop,
                                       onDragEnd,
                                   }: BuilderNodeWrapperProps) {
    const isLayoutNode =
        nodeType === "section" ||
        nodeType === "container" ||
        nodeType === "row" ||
        nodeType === "column";

    return (
        <div
            data-builder-node-id={nodeId}
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            onClick={onClick}
            className={[
                "builder-node-wrapper",
                "group",
                "relative",

                isLayoutNode
                    ? "builder-layout-node"
                    : "",

                nodeType === "column"
                    ? "builder-column-node"
                    : "",

                isSelected
                    ? "builder-node-selected"
                    : "",

                className,
            ]
                .filter(Boolean)
                .join(" ")}
            style={style}
        >
            {children}
        </div>
    );
}