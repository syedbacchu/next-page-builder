import type {
    BuilderNodeStyles,
    BuilderResponsiveStyles,
} from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import { isResponsiveStyles } from "@/features/builder/types/builder.types";

export function setResponsiveStyle(
    styles: BuilderNodeStyles | undefined,
    viewport: BuilderViewport,
    key: string,
    value: string,
): BuilderNodeStyles {
    const existing: BuilderResponsiveStyles =
        styles && isResponsiveStyles(styles)
            ? styles
            : {};

    return {
        desktop: existing.desktop ?? {},
        tablet: existing.tablet ?? {},
        mobile: existing.mobile ?? {},
        [viewport]: {
            ...(existing[viewport] ?? {}),
            [key]: value,
        },
    };
}