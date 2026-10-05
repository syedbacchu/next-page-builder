"use client";

import { useMemo, useState } from "react";

import type { BuilderNode } from "@/features/builder/types/builder.types";

import { NavigatorNode } from "./NavigatorNode";

interface BuilderNavigatorProps {
    document: BuilderNode;
    selectedNodeId: string | null;
    onSelectNode: (nodeId: string) => void;
}

function collectNodeIds(node: BuilderNode): string[] {
    return [
        node.id,
        ...node.children.flatMap((child) =>
            collectNodeIds(child),
        ),
    ];
}

export function BuilderNavigator({
                                     document,
                                     selectedNodeId,
                                     onSelectNode,
                                 }: BuilderNavigatorProps) {
    const allNodeIds = useMemo(
        () => collectNodeIds(document),
        [document],
    );

    const [expandedNodes, setExpandedNodes] =
        useState<Set<string>>(
            () => new Set([document.id]),
        );

    const handleToggle = (nodeId: string) => {
        setExpandedNodes((current) => {
            const next = new Set(current);

            if (next.has(nodeId)) {
                next.delete(nodeId);
            } else {
                next.add(nodeId);
            }

            return next;
        });
    };

    const expandAll = () => {
        setExpandedNodes(new Set(allNodeIds));
    };

    const collapseAll = () => {
        setExpandedNodes(new Set([document.id]));
    };

    return (
        <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
            <div className="flex h-11 items-center justify-between border-b border-slate-200 px-3">
                <h2 className="text-sm font-semibold text-slate-800">
                    Navigator
                </h2>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={expandAll}
                        className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                        title="Expand all"
                    >
                        +
                    </button>

                    <button
                        type="button"
                        onClick={collapseAll}
                        className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                        title="Collapse all"
                    >
                        −
                    </button>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
                <NavigatorNode
                    node={document}
                    level={0}
                    selectedNodeId={selectedNodeId}
                    expandedNodes={expandedNodes}
                    onSelect={onSelectNode}
                    onToggle={handleToggle}
                />
            </div>
        </aside>
    );
}