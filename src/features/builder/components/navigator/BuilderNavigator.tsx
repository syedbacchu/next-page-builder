"use client";

import {
    useEffect,
    useMemo,
    useState,
    type DragEvent,
} from "react";

import type { BuilderNode } from "@/features/builder/types/builder.types";

import {
    NavigatorNode,
    type NavigatorDropPosition,
} from "./NavigatorNode";

interface BuilderNavigatorProps {
    document: BuilderNode;
    selectedNodeId: string | null;
    onSelectNode: (nodeId: string) => void;

    onMoveNode: (
        activeNodeId: string,
        dropPosition: NavigatorDropPosition,
    ) => void;
}

function collectNodeIds(
    node: BuilderNode,
): string[] {
    return [
        node.id,
        ...node.children.flatMap((child) =>
            collectNodeIds(child),
        ),
    ];
}

function findParentIds(
    node: BuilderNode,
    targetId: string,
    parents: string[] = [],
): string[] | null {
    if (node.id === targetId) {
        return parents;
    }

    for (const child of node.children) {
        const result = findParentIds(
            child,
            targetId,
            [...parents, node.id],
        );

        if (result) {
            return result;
        }
    }

    return null;
}

export function BuilderNavigator({
                                     document,
                                     selectedNodeId,
                                     onSelectNode,
                                     onMoveNode,
                                 }: BuilderNavigatorProps) {
    const allNodeIds = useMemo(
        () => collectNodeIds(document),
        [document],
    );

    const [expandedNodes, setExpandedNodes] =
        useState<Set<string>>(
            () => new Set([document.id]),
        );

    const [draggedNodeId, setDraggedNodeId] =
        useState<string | null>(null);

    const [dropPosition, setDropPosition] =
        useState<NavigatorDropPosition | null>(
            null,
        );

    /*
     * Automatically expand selected node parents.
     */
    useEffect(() => {
        if (!selectedNodeId) {
            return;
        }

        const parentIds = findParentIds(
            document,
            selectedNodeId,
        );

        if (!parentIds) {
            return;
        }

        setExpandedNodes((current) => {
            const next = new Set(current);

            let changed = false;

            for (const parentId of parentIds) {
                if (!next.has(parentId)) {
                    next.add(parentId);
                    changed = true;
                }
            }

            return changed ? next : current;
        });
    }, [document, selectedNodeId]);

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
        setExpandedNodes(
            new Set(allNodeIds),
        );
    };

    const collapseAll = () => {
        setExpandedNodes(
            new Set([document.id]),
        );
    };

    const handleDragStart = (
        event: DragEvent<HTMLDivElement>,
        nodeId: string,
    ) => {
        setDraggedNodeId(nodeId);

        event.dataTransfer.effectAllowed = "move";

        event.dataTransfer.setData(
            "application/x-builder-navigator-node",
            nodeId,
        );
    };

    const handleDragOver = (
        event: DragEvent<HTMLDivElement>,
        nodeId: string,
    ) => {
        event.preventDefault();
        event.stopPropagation();

        if (!draggedNodeId) {
            return;
        }

        if (draggedNodeId === nodeId) {
            setDropPosition(null);
            return;
        }

        /*
         * Determine before / after
         * based on mouse position.
         */
        const rect =
            event.currentTarget.getBoundingClientRect();

        const middle =
            rect.top + rect.height / 2;

        const type =
            event.clientY < middle
                ? "before"
                : "after";

        setDropPosition({
            type,
            targetNodeId: nodeId,
        });
    };

    const handleDrop = (
        event: DragEvent<HTMLDivElement>,
        nodeId: string,
    ) => {
        event.preventDefault();
        event.stopPropagation();

        if (!draggedNodeId) {
            return;
        }

        if (draggedNodeId === nodeId) {
            return;
        }

        if (
            !dropPosition ||
            dropPosition.targetNodeId !== nodeId
        ) {
            return;
        }

        onMoveNode(
            draggedNodeId,
            dropPosition,
        );

        setDraggedNodeId(null);
        setDropPosition(null);
    };

    const handleDragEnd = () => {
        setDraggedNodeId(null);
        setDropPosition(null);
    };

    return (
        <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
            {/* HEADER */}
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 px-3">
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

            {/* TREE */}
            <div className="min-h-0 flex-1 overflow-y-auto">
                <NavigatorNode
                    node={document}
                    level={0}
                    selectedNodeId={selectedNodeId}
                    expandedNodes={expandedNodes}
                    draggedNodeId={draggedNodeId}
                    dropPosition={dropPosition}
                    onSelect={onSelectNode}
                    onToggle={handleToggle}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                />
            </div>
        </aside>
    );
}