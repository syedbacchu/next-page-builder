import type { BuilderComponentProps } from "@/features/builder/types/component.types";

interface ColumnProps extends BuilderComponentProps {
    children?: React.ReactNode;
    width?: string;
}

export function Column({
   children,
   width = "100%",
}: ColumnProps) {
    return (
        <div
            style={{
                width,
                minWidth: 0,
            }}
        >
            {children}
        </div>
    );
}