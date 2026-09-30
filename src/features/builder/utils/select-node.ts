import type { BuilderState } from "@/features/builder/store/builder.store";
import { findNodeById } from "@/features/builder/utils/find-node";

export function selectNode(
    state: BuilderState,
    nodeId: string | null,
): BuilderState {
    if (nodeId === null) {
        return {
            ...state,
            selectedNodeId: null,
            insertTargetNodeId: null,
        };
    }

    const node = findNodeById(
        state.document,
        nodeId,
    );

    if (!node) {
        return state;
    }

    return {
        ...state,
        selectedNodeId: node.id,
    };
}