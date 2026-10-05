"use client";

import { BuilderNavigator } from "./BuilderNavigator";
import { useBuilder } from "@/features/builder/store/BuilderProvider";

export function BuilderNavigatorContainer() {
    const { state, dispatch } = useBuilder();

    const handleSelectNode = (nodeId: string) => {
        dispatch({
            type: "SELECT_NODE",
            nodeId,
        });
    };

    return (
        <BuilderNavigator
            document={state.document}
            selectedNodeId={state.selectedNodeId}
            onSelectNode={handleSelectNode}
        />
    );
}