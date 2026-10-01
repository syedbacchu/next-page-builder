"use client";

import type { DragEvent } from "react";

import type { BuilderNode } from "@/features/builder/types/builder.types";
import {useBuilder} from "@/features/builder/store/BuilderProvider";
import {componentRegistry} from "@/features/builder/registry/component-registry";
import {DropPosition} from "@/features/builder/types/drop-position.types";
import {canDropNewComponent} from "@/features/builder/utils/can-drop-new-component";
import {canDropNode} from "@/features/builder/utils/can-drop-node";
import {createBuilderNode} from "@/features/builder/utils/create-node";

interface UseBuilderDragDropOptions {
    node: BuilderNode;
}

interface UseBuilderDragDropReturn {
    handleDragStart: (
        event: DragEvent<HTMLDivElement>,
    ) => void;

    handleDragOver: (
        event: DragEvent<HTMLDivElement>,
    ) => void;

    handleDrop: (
        event: DragEvent<HTMLDivElement>,
    ) => void;

    handleDragEnd: (
        event: DragEvent<HTMLDivElement>,
    ) => void;
}

export function useBuilderDragDrop({
                                       node,
                                   }: UseBuilderDragDropOptions): UseBuilderDragDropReturn {
    const { state, dispatch } = useBuilder();
    function handleDragStart(
        event: DragEvent<HTMLDivElement>,
    ) {
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
    }

    function handleDragOver(
        event: DragEvent<HTMLDivElement>,
    ) {
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
    }

    function handleDrop(
        event: DragEvent<HTMLDivElement>,
    ) {
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
    }

    function handleDragEnd(
        event: DragEvent<HTMLDivElement>,
    ) {
        event.stopPropagation();

        dispatch({
            type: "DRAG_END",
        });
    }

    return {
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    };
}