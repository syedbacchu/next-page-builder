import type { BuilderComponentProps } from "@/features/builder/types/component.types";

interface TextProps extends BuilderComponentProps {
    text?: string;
}

export function Text({
     text = "Lorem ipsum dolor sit amet.",
 }: TextProps) {
    return <p>{text}</p>;
}