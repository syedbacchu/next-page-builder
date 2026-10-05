"use client";

import { BuilderNavigator } from "./BuilderNavigator";
import { useBuilder } from "@/features/builder/store/BuilderProvider";

import type { NavigatorDropPosition } from "./NavigatorNode";

export function BuilderNavigatorContainer() {
    const { state, dispatch } = useBuilder();

    const handleSelectNode = (
        nodeId: string,
    ) => {
        dispatch({
            type: "SELECT_NODE",
            nodeId,
        });
    };

    const handleMoveNode = (
        activeNodeId: string,
        dropPosition: NavigatorDropPosition,
    ) => {
        /*
         * Use the existing builder drag/drop system.
         *
         * 1. Set dragged node
         * 2. Set destination
         * 3. Execute existing DROP_NODE
         * 4. Clear drag state
         */

        dispatch({
            type: "DRAG_START",
            nodeId: activeNodeId,
        });

        dispatch({
            type: "SET_DROP_POSITION",
            position: dropPosition,
        });

        dispatch({
            type: "DROP_NODE",
        });

        dispatch({
            type: "DRAG_END",
        });
    };

    return (
        <BuilderNavigator
            document={state.document}
            selectedNodeId={state.selectedNodeId}
            onSelectNode={handleSelectNode}
            onMoveNode={handleMoveNode}
        />
    );
}