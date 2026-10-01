"use client";

import type { MouseEvent } from "react";

import type { BuilderNode } from "@/features/builder/types/builder.types";
import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { calculateColumnSpan } from "@/features/builder/utils/calculate-column-span";
import { resizeColumnPair } from "@/features/builder/utils/resize-column";
import { findNodeById } from "@/features/builder/utils/find-node";

interface UseBuilderColumnResizeOptions {
    node: BuilderNode;
}

interface UseBuilderColumnResizeReturn {
    handleResizeStart: (
        event: MouseEvent<HTMLDivElement>,
    ) => void;

    handleResizeMove: (
        clientX: number,
    ) => void;

    handleResizeEnd: () => void;
}

export function useBuilderColumnResize({
                                           node,
                                       }: UseBuilderColumnResizeOptions): UseBuilderColumnResizeReturn {
    const { state, dispatch } = useBuilder();

    function handleResizeStart(
        event: MouseEvent<HTMLDivElement>,
    ) {
        event.stopPropagation();

        const currentElement = document.querySelector(
            `[data-builder-node-id="${node.id}"]`,
        );

        if (!currentElement) return;

        const rowElement = currentElement.parentElement;

        if (!rowElement) return;

        const columnElements = Array.from(
            rowElement.children,
        ).filter((element) =>
            element.hasAttribute("data-builder-node-id"),
        );

        const currentIndex = columnElements.findIndex(
            (element) =>
                element.getAttribute("data-builder-node-id") ===
                node.id,
        );

        if (currentIndex === -1) return;

        const nextElement =
            columnElements[currentIndex + 1];

        if (!nextElement) return;

        const nextNodeId =
            nextElement.getAttribute("data-builder-node-id");

        if (!nextNodeId) return;

        const nextNode = findNodeById(
            state.document,
            nextNodeId,
        );

        if (!nextNode) return;

        dispatch({
            type: "START_COLUMN_RESIZE",
            nodeId: node.id,
            nextNodeId: nextNode.id,
            startX: event.clientX,
            startSpan: Number(node.props.span ?? 12),
            nextStartSpan: Number(nextNode.props.span ?? 12),
        });
    }

    function handleResizeMove(clientX: number) {
        if (!state.resize.active) return;

        if (
            state.resize.nodeId !== node.id ||
            state.resize.startX === null ||
            state.resize.startSpan === null ||
            state.resize.nextNodeId === null ||
            state.resize.nextStartSpan === null
        ) {
            return;
        }

        const currentElement = document.querySelector(
            `[data-builder-node-id="${node.id}"]`,
        );

        if (!currentElement) return;

        const rowElement = currentElement.parentElement;

        if (!rowElement) return;

        const rowWidth =
            rowElement.getBoundingClientRect().width;

        if (rowWidth <= 0) return;

        const newCurrentSpan = calculateColumnSpan(
            clientX - state.resize.startX,
            rowWidth,
            state.resize.startSpan,
        );

        const [updatedCurrentSpan, updatedNextSpan] =
            resizeColumnPair(
                [
                    state.resize.startSpan,
                    state.resize.nextStartSpan,
                ],
                0,
                newCurrentSpan,
            );

        if (
            updatedCurrentSpan === state.resize.startSpan &&
            updatedNextSpan === state.resize.nextStartSpan
        ) {
            return;
        }



        const nextNode = findNodeById(
            state.document,
            state.resize.nextNodeId,
        );

        if (!nextNode) return;

        dispatch({
            type: "UPDATE_COLUMN_RESIZE",
            nodeId: state.resize.nodeId,
            nextNodeId: state.resize.nextNodeId,
            span: updatedCurrentSpan,
            nextSpan: updatedNextSpan,
        });
    }

    function handleResizeEnd() {
        dispatch({
            type: "END_COLUMN_RESIZE",
        });
    }

    return {
        handleResizeStart,
        handleResizeMove,
        handleResizeEnd,
    };
}