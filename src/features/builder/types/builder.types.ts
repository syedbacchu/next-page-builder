export type BuilderNodeType =
    | "page"
    | "section"
    | "container"
    | "heading"
    | "text"
    | "image"
    | "button";

export interface BuilderNode {
    id: string;
    type: BuilderNodeType;
    props: Record<string, unknown>;
    children: BuilderNode[];
}

export interface BuilderDocument {
    id: string;
    type: "page";
    props: Record<string, unknown>;
    children: BuilderNode[];
}
export type BuilderNodeStyles = Record<string, string>;

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

