import type { BuilderNode } from "@/features/builder/types/builder.types";

const columnSpans: Record<1 | 2 | 3 | 4, number[]> = {
    1: [12],
    2: [6, 6],
    3: [4, 4, 4],
    4: [3, 3, 3, 3],
};

export function createRowWithColumns(
    columnCount: 1 | 2 | 3 | 4,
): BuilderNode {
    return {
        id: `row-${crypto.randomUUID()}`,
        type: "row",
        props: {
            gap: "16px",
        },
        children: columnSpans[columnCount].map(
            (span) => ({
                id: `column-${crypto.randomUUID()}`,
                type: "column",
                props: {
                    span,
                },
                children: [],
            }),
        ),
    };
}