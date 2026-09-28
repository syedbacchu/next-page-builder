"use client";

import { componentRegistry } from "@/features/builder/registry/component-registry";
import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { createBuilderNode } from "@/features/builder/utils/create-node";
import { findNodeById } from "@/features/builder/utils/find-node";
import type { BuilderNodeType } from "@/features/builder/types/builder.types";

export function BuilderSidebar() {
    const { state, dispatch } = useBuilder();

    const components = Object.values(componentRegistry).filter(
        (component) => component.type !== "page",
    );

    function handleAddComponent(type: BuilderNodeType) {
        if (!state.insertTargetNodeId) {
            console.log("No insert target selected");
            return;
        }

        const selectedNode = findNodeById(
            state.document,
            state.insertTargetNodeId,
        );

        if (!selectedNode) {
            console.log("Insert target node not found");
            return;
        }

        const newNode = createBuilderNode(type);

        dispatch({
            type: "ADD_NODE",
            parentId: selectedNode.id,
            node: newNode,
        });
    }

    return (
        <aside className="w-64 shrink-0 border-r bg-white">
            <div className="border-b px-4 py-3">
                <h2 className="text-sm font-semibold">
                    Elements
                </h2>
            </div>

            <div className="space-y-1 p-3">
                {components.map((component) => (
                    <button
                        key={component.type}
                        type="button"
                        onClick={() =>
                            handleAddComponent(component.type)
                        }
                        className="flex w-full items-center rounded-md border px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                        {component.label}
                    </button>
                ))}
            </div>
        </aside>
    );
}