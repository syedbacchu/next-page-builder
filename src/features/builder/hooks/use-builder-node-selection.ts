"use client";

import type { MouseEvent } from "react";
import type { BuilderNode } from "@/features/builder/types/builder.types";
import { useBuilder } from "@/features/builder/store/BuilderProvider";

interface UseBuilderNodeSelectionOptions {
    node: BuilderNode;
}

interface UseBuilderNodeSelectionReturn {
    handleNodeClick: (
        event: MouseEvent<HTMLDivElement>,
    ) => void;
}

export function useBuilderNodeSelection({
                                            node,
                                        }: UseBuilderNodeSelectionOptions): UseBuilderNodeSelectionReturn {
    const { dispatch } = useBuilder();

    function handleNodeClick(
        event: MouseEvent<HTMLDivElement>,
    ) {
        event.stopPropagation();

        dispatch({
            type: "SELECT_NODE",
            nodeId: node.id,
        });

        if (
            node.type === "section" ||
            node.type === "container"
        ) {
            dispatch({
                type: "SET_INSERT_TARGET",
                nodeId: node.id,
            });
        }
    }

    return {
        handleNodeClick,
    };
}