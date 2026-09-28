import type { BuilderNode } from "@/features/builder/types/builder.types";

export type DropPosition =
    | {
    type: "before";
    targetNodeId: string;
}
    | {
    type: "after";
    targetNodeId: string;
}
    | {
    type: "inside";
    targetNodeId: string;
};

export interface BuilderDragState {
    activeNodeId: string | null;
    activeNode: BuilderNode | null;
    dropPosition: DropPosition | null;
}