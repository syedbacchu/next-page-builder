import type { BuilderComponentProps } from "@/features/builder/types/component.types";

interface RowProps extends BuilderComponentProps {
    children?: React.ReactNode;
    gap?: string;
}

export function Row({
    children,
    gap = "16px",
}: RowProps) {
    return (
        <div
            className="w-full"
            style={{
                display: "flex",
                flexDirection: "row",
                gap,
            }}
        >
            {children}
        </div>
    );
}