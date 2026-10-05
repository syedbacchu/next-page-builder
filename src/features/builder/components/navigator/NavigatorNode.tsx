"use client";

import type { MouseEvent } from "react";
import type { BuilderNode } from "@/features/builder/types/builder.types";

interface NavigatorNodeProps {
    node: BuilderNode;
    level: number;
    selectedNodeId: string | null;
    expandedNodes: Set<string>;
    onSelect: (nodeId: string) => void;
    onToggle: (nodeId: string) => void;
}

function getNodeLabel(node: BuilderNode): string {
    const label = node.props?.label;

    if (typeof label === "string" && label.trim()) {
        return label;
    }

    const text = node.props?.text;

    if (typeof text === "string" && text.trim()) {
        return text.length > 24
            ? `${text.slice(0, 24)}...`
            : text;
    }

    return (
        node.type.charAt(0).toUpperCase() +
        node.type.slice(1)
    );
}

function getNodeIcon(
    type: BuilderNode["type"],
): string {
    switch (type) {
        case "page":
            return "📄";

        case "section":
            return "▤";

        case "container":
            return "▥";

        case "row":
            return "↔";

        case "column":
            return "▥";

        case "heading":
            return "H";

        case "text":
            return "T";

        case "image":
            return "▧";

        case "button":
            return "▣";

        default:
            return "•";
    }
}

export function NavigatorNode({
                                  node,
                                  level,
                                  selectedNodeId,
                                  expandedNodes,
                                  onSelect,
                                  onToggle,
                              }: NavigatorNodeProps) {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodeId === node.id;

    const handleClick = (
        event: MouseEvent<HTMLDivElement>,
    ) => {
        event.stopPropagation();

        onSelect(node.id);
    };

    const handleToggle = (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        event.stopPropagation();

        onToggle(node.id);
    };

    return (
        <div className="w-full">
            <div
                onClick={handleClick}
                className={[
                    "group flex h-9 w-full cursor-pointer items-center",
                    "border-b border-slate-100",
                    "text-sm transition-colors",
                    isSelected
                        ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"
                        : "text-slate-700 hover:bg-slate-50",
                ].join(" ")}
                style={{
                    paddingLeft: `${8 + level * 16}px`,
                    paddingRight: "8px",
                }}
            >
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={!hasChildren}
                    className={[
                        "mr-1 flex h-5 w-5 shrink-0",
                        "items-center justify-center",
                        "rounded text-xs",
                        hasChildren
                            ? "text-slate-500 hover:bg-slate-200"
                            : "cursor-default text-transparent",
                    ].join(" ")}
                >
                    {hasChildren
                        ? isExpanded
                            ? "▾"
                            : "▸"
                        : "•"}
                </button>

                <span className="mr-2 w-5 shrink-0 text-center text-xs">
                    {getNodeIcon(node.type)}
                </span>

                <span className="min-w-0 flex-1 truncate font-medium">
                    {getNodeLabel(node)}
                </span>

                <span className="ml-2 hidden text-[10px] uppercase text-slate-400 group-hover:block">
                    {node.type}
                </span>
            </div>

            {hasChildren && isExpanded && (
                <div>
                    {node.children.map((child) => (
                        <NavigatorNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            selectedNodeId={selectedNodeId}
                            expandedNodes={expandedNodes}
                            onSelect={onSelect}
                            onToggle={onToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}