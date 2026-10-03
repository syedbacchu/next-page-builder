import type {
    BuilderNode,
} from "@/features/builder/types/builder.types";

import type {
    BuilderViewport,
} from "@/features/builder/types/builder-viewport.types";

import {
    setResponsiveInteractionStyle,
} from "@/features/builder/utils/set-responsive-interaction-style";

export function updateNodeInteractionStyles(
    node: BuilderNode,
    nodeId: string,
    interaction: "hover",
    viewport: BuilderViewport,
    key: string,
    value: string,
): BuilderNode {
    if (node.id === nodeId) {
        return {
            ...node,

            interactions: {
                ...node.interactions,

                styles:
                    setResponsiveInteractionStyle(
                        node.interactions?.styles,
                        interaction,
                        viewport,
                        key,
                        value,
                    ),
            },
        };
    }

    return {
        ...node,

        children: node.children.map((child) =>
            updateNodeInteractionStyles(
                child,
                nodeId,
                interaction,
                viewport,
                key,
                value,
            ),
        ),
    };
}