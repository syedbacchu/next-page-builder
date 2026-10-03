"use client";

import type { ReactNode, CSSProperties } from "react";

interface BuilderNodeWrapperProps {
    nodeId: string;
    nodeType: string;
    isSelected: boolean;
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
    onClick: (
        event: React.MouseEvent<HTMLDivElement>,
    ) => void;
    onDragStart: (
        event: React.DragEvent<HTMLDivElement>,
    ) => void;
    onDragOver: (
        event: React.DragEvent<HTMLDivElement>,
    ) => void;
    onDrop: (
        event: React.DragEvent<HTMLDivElement>,
    ) => void;
    onDragEnd: (
        event: React.DragEvent<HTMLDivElement>,
    ) => void;
}

export function BuilderNodeWrapper({
                                       nodeId,
                                       nodeType,
                                       isSelected,
                                       children,
                                       style,
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
                isLayoutNode
                    ? "builder-layout-node"
                    : "",
                nodeType === "column"
                    ? "builder-column-node"
                    : "",
                isSelected
                    ? "builder-node-selected"
                    : "",
            ].join(" ")}
            style={style}
        >
            {children}
        </div>
    );
}