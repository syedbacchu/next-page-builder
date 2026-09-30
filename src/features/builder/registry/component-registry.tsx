import type { ComponentType } from "react";

import { Button } from "@/features/builder/components/basic/Button";
import { Heading } from "@/features/builder/components/basic/Heading";
import { Image } from "@/features/builder/components/basic/Image";
import { Text } from "@/features/builder/components/basic/Text";
import type { BuilderNodeType } from "@/features/builder/types/builder.types";
import type { BuilderComponentProps } from "@/features/builder/types/component.types";
import type { ComponentSchema } from "@/features/builder/types/component-schema.types";
import { Container } from "@/features/builder/components/basic/Container";
import { Row } from "@/features/builder/components/basic/Row";
import { Column } from "@/features/builder/components/basic/Column";

export interface BuilderComponentDefinition {
    type: BuilderNodeType;
    label: string;
    category: string;
    canHaveChildren: boolean;
    allowedParentTypes?: BuilderNodeType[];
    component: ComponentType<BuilderComponentProps>;
    schema?: ComponentSchema;
}

export const componentRegistry: Record<
    BuilderNodeType,
    BuilderComponentDefinition
> = {
    page: {
        type: "page",
        label: "Page",
        category: "layout",
        canHaveChildren: true,
        allowedParentTypes: [],
        component: ({ children }) => <>{children}</>,
    },

    section: {
        type: "section",
        label: "Section",
        category: "layout",
        canHaveChildren: true,
        allowedParentTypes: ["page"],
        component: ({ children }) => <section>{children}</section>,
    },

    container: {
        type: "container",
        label: "Container",
        category: "layout",
        canHaveChildren: true,
        allowedParentTypes: ["section", "page"],
        component: Container,

        schema: {
            direction: {
                type: "select",
                label: "Direction",
                source: "props",
                defaultValue: "column",
                options: [
                    {
                        label: "Column",
                        value: "column",
                    },
                    {
                        label: "Row",
                        value: "row",
                    },
                ],
            },

            gap: {
                type: "text",
                label: "Gap",
                source: "props",
                defaultValue: "0px",
            },
            align: {
                type: "select",
                label: "Align",
                source: "props",
                defaultValue: "stretch",
                options: [
                    {
                        label: "Start",
                        value: "flex-start",
                    },
                    {
                        label: "Center",
                        value: "center",
                    },
                    {
                        label: "End",
                        value: "flex-end",
                    },
                    {
                        label: "Stretch",
                        value: "stretch",
                    },
                ],
            },

            justify: {
                type: "select",
                label: "Justify",
                source: "props",
                defaultValue: "flex-start",
                options: [
                    {
                        label: "Start",
                        value: "flex-start",
                    },
                    {
                        label: "Center",
                        value: "center",
                    },
                    {
                        label: "End",
                        value: "flex-end",
                    },
                    {
                        label: "Space Between",
                        value: "space-between",
                    },
                    {
                        label: "Space Around",
                        value: "space-around",
                    },
                    {
                        label: "Space Evenly",
                        value: "space-evenly",
                    },
                ],
            },
        },
    },
    row: {
        type: "row",
        label: "Row",
        category: "layout",
        canHaveChildren: true,
        allowedParentTypes: ["section", "container"],
        component: Row,
        schema: {
            gap: {
                type: "text",
                label: "Gap",
                source: "props",
                defaultValue: "16px",
            },
        },
    },
    column: {
        type: "column",
        label: "Column",
        category: "layout",
        canHaveChildren: true,
        allowedParentTypes: ["row"],
        component: Column,
        schema: {
            width: {
                type: "text",
                label: "Width",
                source: "props",
                defaultValue: "100%",
            },
            span: {
                type: "number",
                label: "Column Span",
                source: "props",
                defaultValue: 12,
            },
        },
    },
    heading: {
        type: "heading",
        label: "Heading",
        category: "Basic",
        canHaveChildren: false,
        allowedParentTypes: ["container", "column"],
        component: Heading,
        schema: {
            text: {
                type: "text",
                label: "Text",
                source: "props",
                defaultValue: "Heading",
            },

            level: {
                type: "select",
                label: "Heading Level",
                source: "props",
                defaultValue: 2,
                options: [
                    { label: "H1", value: 1 },
                    { label: "H2", value: 2 },
                    { label: "H3", value: 3 },
                    { label: "H4", value: 4 },
                    { label: "H5", value: 5 },
                    { label: "H6", value: 6 },
                ],
            },
            fontSize: {
                type: "text",
                label: "Font Size",
                source: "styles",
                defaultValue: "48px",
            },
            color: {
                type: "color",
                label: "Text Color",
                source: "styles",
                defaultValue: "#111827",
            },

            backgroundColor: {
                type: "color",
                label: "Background Color",
                source: "styles",
                defaultValue: "transparent",
            },
        },
    },

    text: {
        type: "text",
        label: "Text",
        category: "basic",
        canHaveChildren: false,
        component: Text,
        allowedParentTypes: ["container", "column"],

        schema: {
            text: {
                type: "textarea",
                label: "Text",
                defaultValue: "Lorem ipsum dolor sit amet.",
            },
        },
    },

    image: {
        type: "image",
        label: "Image",
        category: "basic",
        canHaveChildren: false,
        component: Image,
        allowedParentTypes: ["container", "column"],

        schema: {
            src: {
                type: "image",
                label: "Image",
                defaultValue: "https://placehold.co/600x400",
            },

            alt: {
                type: "text",
                label: "Alt Text",
                defaultValue: "Image",
            },
        },
    },

    button: {
        type: "button",
        label: "Button",
        category: "basic",
        canHaveChildren: false,
        component: Button,
        allowedParentTypes: ["container", "column"],

        schema: {
            text: {
                type: "text",
                label: "Button Text",
                defaultValue: "Button",
            },

            href: {
                type: "url",
                label: "Link",
                defaultValue: "#",
            },
        },
    },
};