import type { BuilderNode } from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import { getColumnSpan } from "@/features/builder/utils/get-column-span";

export function getColumnsPerRow(
    row: BuilderNode,
    viewport: BuilderViewport,
): number {
    const columns = row.children.filter(
        (child) => child.type === "column",
    );

    if (columns.length === 0) {
        return 1;
    }

    const firstSpan = getColumnSpan(
        columns[0].props.span,
        viewport,
    );

    return Math.max(1, Math.round(12 / firstSpan));
}