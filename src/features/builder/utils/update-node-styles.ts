import type {
    BuilderNode,
    BuilderNodeStyles,
} from "@/features/builder/types/builder.types";

import {
    isResponsiveStyles,
} from "@/features/builder/types/builder.types";

export function updateNodeStyles(
    node: BuilderNode,
    nodeId: string,
    styles: BuilderNodeStyles,
): BuilderNode {
    if (node.id === nodeId) {
        const currentStyles = node.styles;

        // New responsive styles
        if (isResponsiveStyles(styles)) {
            const existingResponsiveStyles =
                currentStyles &&
                isResponsiveStyles(currentStyles)
                    ? currentStyles
                    : {
                        desktop:
                            currentStyles ?? {},
                    };

            return {
                ...node,
                styles: {
                    desktop: {
                        ...(existingResponsiveStyles.desktop ?? {}),
                        ...(styles.desktop ?? {}),
                    },

                    tablet: {
                        ...(existingResponsiveStyles.tablet ?? {}),
                        ...(styles.tablet ?? {}),
                    },

                    mobile: {
                        ...(existingResponsiveStyles.mobile ?? {}),
                        ...(styles.mobile ?? {}),
                    },
                },
            };
        }

        // Legacy flat styles
        if (
            currentStyles &&
            isResponsiveStyles(currentStyles)
        ) {
            return {
                ...node,
                styles: {
                    ...currentStyles,
                    desktop: {
                        ...(currentStyles.desktop ?? {}),
                        ...styles,
                    },
                },
            };
        }

        return {
            ...node,
            styles: {
                ...(currentStyles ?? {}),
                ...styles,
            },
        };
    }

    return {
        ...node,
        children: node.children.map((child) =>
            updateNodeStyles(
                child,
                nodeId,
                styles,
            ),
        ),
    };
}