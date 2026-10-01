import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";

export type BuilderResponsiveSpan = {
    desktop?: number;
    tablet?: number;
    mobile?: number;
};

export type BuilderSpanValue =
    | number
    | BuilderResponsiveSpan;

export function getColumnSpan(
    span: unknown,
    viewport: BuilderViewport,
): number {
    if (typeof span === "number") {
        return Math.min(12, Math.max(1, span));
    }

    if (
        typeof span === "object" &&
        span !== null
    ) {
        const responsiveSpan =
            span as BuilderResponsiveSpan;

        const value =
            responsiveSpan[viewport] ??
            responsiveSpan.desktop ??
            12;

        return Math.min(
            12,
            Math.max(1, Number(value)),
        );
    }

    return 12;
}