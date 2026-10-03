"use client";

import type { DragEvent } from "react";

import type { BuilderNode } from "@/features/builder/types/builder.types";
import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { componentRegistry } from "@/features/builder/registry/component-registry";
import type { DropPosition } from "@/features/builder/types/drop-position.types";
import { canDropNewComponent } from "@/features/builder/utils/can-drop-new-component";
import { canDropNode } from "@/features/builder/utils/can-drop-node";
import { createBuilderNode } from "@/features/builder/utils/create-node";

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

        event.dataTransfer.effectAllowed = "move";

        dispatch({
            type: "DRAG_START",
            nodeId: node.id,
        });
    }

    function handleDragOver(
        event: DragEvent<HTMLDivElement>,
    ) {
        event.preventDefault();
        event.stopPropagation();

        const dragTypes = event.dataTransfer.types;

        const isNewComponentDrag =
            dragTypes.includes(
                "application/x-builder-component",
            );

        const activeNodeId =
            state.drag.activeNodeId;

        const rect =
            event.currentTarget.getBoundingClientRect();

        const offsetY =
            event.clientY - rect.top;

        const ratio =
            rect.height > 0
                ? offsetY / rect.height
                : 0.5;

        const definition =
            componentRegistry[node.type];

        /*
         * ============================================
         * NEW COMPONENT FROM SIDEBAR
         * ============================================
         */

        if (isNewComponentDrag) {
            event.dataTransfer.dropEffect = "copy";

            const componentType =
                event.dataTransfer.getData(
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

            const position: DropPosition = {
                type: "inside",
                targetNodeId: node.id,
            };

            console.log("=== DRAG OVER ===");

            console.log("DRAGGING:", activeNodeId);

            console.log("TARGET:", node.id);

            console.log("TARGET TYPE:", node.type);

            console.log("POSITION:", position);
            dispatch({
                type: "SET_DROP_POSITION",
                position,
            });

            return;
        }

        /*
         * ============================================
         * EXISTING BUILDER NODE
         * ============================================
         */

        if (!activeNodeId) {
            return;
        }

        event.dataTransfer.dropEffect = "move";

        /*
         * Don't allow a node to drop on itself.
         */
        if (activeNodeId === node.id) {
            event.dataTransfer.dropEffect = "none";
            return;
        }

        /*
         * ============================================
         * DROP INSIDE
         * ============================================
         *
         * If this node can contain children and the
         * cursor is around the middle, move inside.
         */

        let position: DropPosition;

        if (
            definition.canHaveChildren &&
            ratio > 0.25 &&
            ratio < 0.75
        ) {
            position = {
                type: "inside",
                targetNodeId: node.id,
            };
        } else {
            /*
             * ========================================
             * BEFORE / AFTER
             * ========================================
             */

            position = {
                type:
                    ratio < 0.5
                        ? "before"
                        : "after",

                targetNodeId: node.id,
            };
        }

        /*
         * ============================================
         * VALIDATE
         * ============================================
         */

        if (
            !canDropNode(
                state.document,
                activeNodeId,
                position,
            )
        ) {
            event.dataTransfer.dropEffect = "none";
            return;
        }

        /*
         * ============================================
         * SET DROP POSITION
         * ============================================
         */

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

        const componentType =
            event.dataTransfer.getData(
                "application/x-builder-component",
            );

        /*
         * ============================================
         * NEW COMPONENT FROM SIDEBAR
         * ============================================
         */

        if (componentType) {
            const typedComponentType =
                componentType as BuilderNode["type"];

            if (
                !canDropNewComponent(
                    typedComponentType,
                    node.type,
                )
            ) {


                return;
            }

            const newNode =
                createBuilderNode(
                    typedComponentType,
                );

            dispatch({
                type: "ADD_NODE",
                parentId: node.id,
                node: newNode,
            });


            return;
        }

        /*
         * ============================================
         * EXISTING BUILDER NODE
         * ============================================
         */

        const activeNodeId =
            state.drag.activeNodeId;

        if (!activeNodeId) {
            return;
        }

        /*
         * Never drop a node onto itself.
         */

        if (activeNodeId === node.id) {
            return;
        }

        /*
         * Final validation.
         */

        const dropPosition =
            state.drag.dropPosition;

        if (!dropPosition) {
            return;
        }

        if (
            !canDropNode(
                state.document,
                activeNodeId,
                dropPosition,
            )
        ) {
            return;
        }

        /*
         * DROP_NODE will perform the actual move
         * through builder.drag.ts.
         */

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