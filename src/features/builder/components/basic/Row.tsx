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
            className="grid w-full"
            style={{
                gridTemplateColumns:
                    "repeat(12, minmax(0, 1fr))",
                gap,
            }}
        >
            {children}
        </div>
    );
}