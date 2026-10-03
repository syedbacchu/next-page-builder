import type {
    BuilderInteractionStyles,
} from "@/features/builder/types/builder.types";

import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";

export function getResponsiveInteractionStyle(
    interactions: BuilderInteractionStyles | undefined,
    interaction: "hover",
    viewport: BuilderViewport,
    key: string,
): string | undefined {
    const styles =
        interactions?.[interaction];

    if (!styles) {
        return undefined;
    }

    return (
        styles[viewport]?.[key] ??
        styles.desktop?.[key]
    );
}