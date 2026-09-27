import type { BuilderComponentProps } from "@/features/builder/types/component.types";

interface ImageProps extends BuilderComponentProps {
    src?: string;
    alt?: string;
}

export function Image({
  src = "https://placehold.co/600x400",
  alt = "Image",
}: ImageProps) {
    return (
        <img
            src={src}
            alt={alt}
            className="max-w-full"
        />
    );
}