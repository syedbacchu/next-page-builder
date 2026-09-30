import type { BuilderComponentProps } from "@/features/builder/types/component.types";

interface ContainerProps extends BuilderComponentProps {
    children?: React.ReactNode;
    direction?: "row" | "column";
    gap?: string;
    align?: "flex-start" | "center" | "flex-end" | "stretch";
    justify?:
        | "flex-start"
        | "center"
        | "flex-end"
        | "space-between"
        | "space-around"
        | "space-evenly";
}

export function Container({
  children,
  direction = "column",
  gap = "0px",
  align = "stretch",
  justify = "flex-start",
}: ContainerProps) {
    return (
        <div
            className="w-full"
            style={{
                display: "flex",
                flexDirection: direction,
                alignItems: align,
                justifyContent: justify,
                gap,
            }}
        >
            {children}
        </div>
    );
}