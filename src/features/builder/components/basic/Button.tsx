import type { BuilderComponentProps } from "@/features/builder/types/component.types";

interface ButtonProps extends BuilderComponentProps {
    text?: string;
    href?: string;
}

export function Button({
   text = "Button",
   href = "#",
}: ButtonProps) {
    return (
        <a
            href={href}
            className="inline-block rounded-md px-5 py-2.5"
        >
            {text}
        </a>
    );
}