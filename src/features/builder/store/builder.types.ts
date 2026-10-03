import type {BuilderDocument, BuilderNodeStyles} from "@/features/builder/types/builder.types";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";
import type { DropPosition } from "@/features/builder/types/drop-position.types";
import type { BuilderNode } from "@/features/builder/types/builder.types";

export interface BuilderHistory {
    past: BuilderDocument[];
    future: BuilderDocument[];
}

export interface BuilderState {
    document: BuilderDocument;
    selectedNodeId: string | null;
    insertTargetNodeId: string | null;
    viewport: BuilderViewport;

    drag: {
        activeNodeId: string | null;
        dropPosition: DropPosition | null;
    };

    history: BuilderHistory;

    resize: {
        active: boolean;
        nodeId: string | null;
        nextNodeId: string | null;
        startX: number | null;
        startSpan: number | null;
        nextStartSpan: number | null;
        startDocument: BuilderDocument | null;
    };
}

export type BuilderAction =
    | {
    type: "SELECT_NODE";
    nodeId: string | null;
}
    | {
    type: "SET_DOCUMENT";
    document: BuilderDocument;
}
    | {
    type: "UPDATE_NODE_PROPS";
    nodeId: string;
    props: Record<string, unknown>;
}
    | {
    type: "UPDATE_NODE_STYLES";
    nodeId: string;
    viewport: BuilderViewport;
    key: string;
    value: string;
}
    | {
    type: "ADD_NODE";
    parentId: string;
    node: BuilderNode;
    index?: number;
}| {
    type: "DELETE_NODE";
    nodeId: string;
}| {
    type: "SET_INSERT_TARGET";
    nodeId: string | null;
}| {
    type: "DUPLICATE_NODE";
    nodeId: string;
}| {
    type: "MOVE_NODE_UP";
    nodeId: string;
}| {
    type: "MOVE_NODE_DOWN";
    nodeId: string;
}| {
    type: "UNDO";
}| {
    type: "REDO";
}| {
    type: "ADD_NODE_BEFORE";
    targetNodeId: string;
    node: BuilderNode;
} | {
    type: "ADD_NODE_AFTER";
    targetNodeId: string;
    node: BuilderNode;
}| {
    type: "DRAG_START";
    nodeId: string;
}| {
    type: "DRAG_END";
}| {
    type: "SET_DROP_POSITION";
    position: DropPosition;
}| {
    type: "DROP_NODE";
}| {
    type: "SET_VIEWPORT";
    viewport: BuilderViewport;
}| {
    type: "START_COLUMN_RESIZE";
    nodeId: string;
    nextNodeId: string;
    startX: number;
    startSpan: number;
    nextStartSpan: number;
}
    | {
    type: "END_COLUMN_RESIZE";
}| {

    type: "UPDATE_COLUMN_RESIZE";
    nodeId: string;
    nextNodeId: string;
    span: number;
    nextSpan: number;
    viewport: BuilderViewport;

}| {
    type: "SET_RESPONSIVE_COLUMN_LAYOUT";
    rowId: string;
    viewport: BuilderViewport;
    columnsPerRow: number;
} | {
    type: "UPDATE_NODE_INTERACTION_STYLES";
    nodeId: string;
    interaction: "hover";
    viewport: BuilderViewport;
    key: string;
    value: string;
};