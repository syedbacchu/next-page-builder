import type { ElementType } from "react";

import type { BuilderComponentProps } from "@/features/builder/types/component.types";

interface HeadingProps extends BuilderComponentProps {
    text?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({
    text = "Heading",
    level = 2,
}: HeadingProps) {
    console.log("HEADING COMPONENT RENDER:", {
        text,
        level,
    });
    const Tag: ElementType = `h${level}`;

    return <Tag>{text}</Tag>;
}