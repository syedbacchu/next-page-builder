import type { ElementType } from "react";

import type { BuilderComponentProps } from "@/features/builder/types/component.types";

interface HeadingProps extends BuilderComponentProps {
    text?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const headingWeights = {
    1: "font-bold",
    2: "font-bold",
    3: "font-bold",
    4: "font-semibold",
    5: "font-semibold",
    6: "font-semibold",
};

export function Heading({
    text = "Heading",
    level = 2,
}: HeadingProps) {
    const Tag: ElementType = `h${level}`;

    return (
        <Tag className={headingWeights[level]}>
            {text}
        </Tag>
    );
}