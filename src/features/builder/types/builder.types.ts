import type {
    BuilderViewport,
} from "@/features/builder/types/builder-viewport.types";

export type BuilderNodeType =
    | "page"
    | "section"
    | "container"
    | "heading"
    | "text"
    | "image"
    | "button";


export type BuilderStyleValue = string;

export interface BuilderResponsiveStyles {
    desktop?: Record<string, BuilderStyleValue>;
    tablet?: Record<string, BuilderStyleValue>;
    mobile?: Record<string, BuilderStyleValue>;
}

export type BuilderNodeStyles =
    | Record<string, string>
    | BuilderResponsiveStyles;

export function isResponsiveStyles(
    styles: BuilderNodeStyles,
): styles is BuilderResponsiveStyles {
    return (
        "desktop" in styles ||
        "tablet" in styles ||
        "mobile" in styles
    );
}

export function getStyleValue(
    styles: BuilderNodeStyles | undefined,
    key: string,
    viewport: BuilderViewport = "desktop",
): string | undefined {
    if (!styles) {
        return undefined;
    }

    if (isResponsiveStyles(styles)) {
        return (
            styles[viewport]?.[key] ??
            styles.desktop?.[key]
        );
    }

    return styles[key];
}

export interface BuilderNode {
    id: string;
    type: BuilderNodeType;
    props: Record<string, unknown>;
    styles?: BuilderNodeStyles;
    children: BuilderNode[];
}

export interface BuilderDocument {
    id: string;
    type: "page";
    props: Record<string, unknown>;
    styles?: BuilderNodeStyles;
    children: BuilderNode[];
}