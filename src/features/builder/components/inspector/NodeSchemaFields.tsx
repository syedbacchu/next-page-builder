"use client";

import type { BuilderNode } from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import { BuilderField } from "@/features/builder/components/BuilderField";
import { getStyleValue } from "@/features/builder/types/builder.types";
import { getColumnSpan } from "@/features/builder/utils/get-column-span";

interface Props {
    node: BuilderNode;
    schema: Record<string, any>;
    viewport: BuilderViewport;
    onChange: (
        key: string,
        value: unknown,
        source?: "props" | "styles",
    ) => void;
}

export function NodeSchemaFields({
                                     node,
                                     schema,
                                     viewport,
                                     onChange,
                                 }: Props) {
    return (
        <>
            {Object.entries(schema).map(([key, field]) => (
                <BuilderField
                    key={key}
                    name={key}
                    field={field}
                    value={
                        field.source === "styles"
                            ? getStyleValue(
                                node.styles,
                                key,
                                viewport,
                            ) ??
                            field.defaultValue ??
                            ""
                            : node.type === "column" &&
                            key === "span"
                                ? getColumnSpan(
                                    node.props.span,
                                    viewport,
                                )
                                : node.props[key] ??
                                field.defaultValue ??
                                ""
                    }
                    onChange={(value) =>
                        onChange(
                            key,
                            value,
                            field.source ?? "props",
                        )
                    }
                />
            ))}
        </>
    );
}