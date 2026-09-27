export type ComponentFieldType =
    | "text"
    | "textarea"
    | "number"
    | "select"
    | "color"
    | "url"
    | "image";

export interface ComponentFieldOption {
    label: string;
    value: string | number;
}

export interface ComponentField {
    type: ComponentFieldType;
    label: string;
    source?: "props" | "styles";
    defaultValue?: unknown;
    options?: ComponentFieldOption[];
}

export type ComponentSchema = Record<string, ComponentField>;