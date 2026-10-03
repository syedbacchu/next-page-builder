import type {
    BuilderNode,
} from "@/features/builder/types/builder.types";

import type {
    BuilderViewport,
} from "@/features/builder/types/builder-viewport.types";

import {
    getResponsiveInteractionStyle,
} from "@/features/builder/utils/get-responsive-interaction-style";

export function getHoverStyles(
    node: BuilderNode,
    viewport: BuilderViewport,
): Record<string, string> {
    const hoverKeys = [
        "color",
        "background-color",
        "border-color",
        "border-width",
        "border-style",
        "border-radius",
        "box-shadow",
        "opacity",
        "transform",
        "text-decoration",
    ];

    const styles: Record<string, string> = {};

    for (const key of hoverKeys) {
        const value =
            getResponsiveInteractionStyle(
                node.interactions?.styles,
                "hover",
                viewport,
                key,
            );

        if (value) {
            styles[key] = value;
        }
    }

    return styles;
}