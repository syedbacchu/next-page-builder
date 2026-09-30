import type {
    BuilderNodeStyles,
} from "@/features/builder/types/builder.types";

import {
    isResponsiveStyles,
} from "@/features/builder/types/builder.types";

import type {
    BuilderViewport,
} from "@/features/builder/types/builder-viewport.types";

export function getNodeStyles(
    styles: BuilderNodeStyles | undefined,
    viewport: BuilderViewport,
): React.CSSProperties {
    if (!styles) {
        return {};
    }

    if (isResponsiveStyles(styles)) {
        return {
            ...(styles.desktop ?? {}),
            ...(viewport === "tablet"
                ? styles.tablet ?? {}
                : viewport === "mobile"
                    ? styles.mobile ?? {}
                    : {}),
        };
    }

    return styles;
}