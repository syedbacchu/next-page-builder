import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import type { BuilderResponsiveSpan } from "./get-column-span";

export function setColumnSpan(
    span: unknown,
    viewport: BuilderViewport,
    value: number,
): BuilderResponsiveSpan {
    const safeValue = Math.min(12, Math.max(1, value));

    const existing =
        typeof span === "object" && span !== null
            ? (span as BuilderResponsiveSpan)
            : {};

    const desktopFallback =
        typeof span === "number"
            ? span
            : existing.desktop ??
            existing.tablet ??
            existing.mobile ??
            12;

    return {
        desktop: existing.desktop ?? desktopFallback,
        tablet: existing.tablet,
        mobile: existing.mobile,
        [viewport]: safeValue,
    };
}