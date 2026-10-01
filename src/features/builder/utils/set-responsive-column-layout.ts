import type { BuilderNode } from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import { setColumnSpan } from "@/features/builder/utils/set-column-span";

export function setResponsiveColumnLayout(
    columns: BuilderNode[],
    viewport: BuilderViewport,
    columnsPerRow: number,
): BuilderNode[] {
    const safeColumnsPerRow = Math.min(
        12,
        Math.max(1, columnsPerRow),
    );

    const span = Math.floor(12 / safeColumnsPerRow);

    return columns.map((column) => ({
        ...column,
        props: {
            ...column.props,
            span: setColumnSpan(
                column.props.span,
                viewport,
                span,
            ),
        },
    }));
}