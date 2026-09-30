import type { BuilderComponentProps } from "@/features/builder/types/component.types";

interface ColumnProps extends BuilderComponentProps {
    children?: React.ReactNode;
    span?: number;
}

export function Column({
   children,
}: ColumnProps) {
    return (
        <div className="min-h-[80px] min-w-0">
            {children}
        </div>
    );
}