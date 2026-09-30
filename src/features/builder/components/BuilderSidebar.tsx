"use client";

import { componentRegistry } from "@/features/builder/registry/component-registry";
import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { createBuilderNode } from "@/features/builder/utils/create-node";
import { findNodeById } from "@/features/builder/utils/find-node";
import type { BuilderNodeType } from "@/features/builder/types/builder.types";
import {canAddNodeToParent} from "@/features/builder/utils/can-add-node";
import { findValidParentForComponent } from "@/features/builder/utils/find-valid-parent";
import {createRowWithColumns} from "@/features/builder/utils/create-row-with-columns";

export function BuilderSidebar() {
    const { state, dispatch } = useBuilder();

    const components = Object.values(componentRegistry).filter(
        (component) =>
            component.type !== "page" &&
            component.type !== "row" &&
            component.type !== "column",
    );

    function handleAddComponent(type: BuilderNodeType) {
        const insertTargetId =
            state.insertTargetNodeId;

        if (!insertTargetId) {
            return;
        }

        const parent = findValidParentForComponent(
            state.document,
            insertTargetId,
            type,
        );

        if (!parent) {
            return;
        }

        const newNode = createBuilderNode(type);

        dispatch({
            type: "ADD_NODE",
            parentId: parent.id,
            node: newNode,
        });
    }

    function handleAddRow(columnCount: 1 | 2 | 3 | 4) {
        const insertTargetId = state.insertTargetNodeId;

        if (!insertTargetId) {
            return;
        }

        const parent = findValidParentForComponent(
            state.document,
            insertTargetId,
            "row",
        );

        if (!parent) {
            return;
        }

        const newRow = createRowWithColumns(columnCount);

        dispatch({
            type: "ADD_NODE",
            parentId: parent.id,
            node: newRow,
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
                <div className="mb-4">
                    <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Columns
                    </p>

                    <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((count) => (
                            <button
                                key={count}
                                type="button"
                                onClick={() =>
                                    handleAddRow(
                                        count as 1 | 2 | 3 | 4,
                                    )
                                }
                                className="flex flex-col items-center gap-1 rounded-md border border-slate-200 bg-white p-2 transition hover:border-blue-400 hover:bg-blue-50"
                            >
                                <div className="flex h-8 w-full gap-0.5">
                                    {Array.from({ length: count }).map(
                                        (_, index) => (
                                            <span
                                                key={index}
                                                className="flex-1 rounded-sm border border-slate-300 bg-slate-100"
                                            />
                                        ),
                                    )}
                                </div>

                                <span className="text-[11px] font-medium text-slate-600">
                    {count}
                </span>
                            </button>
                        ))}
                    </div>
                </div>
                {components.map((component) => (
                    <button
                        key={component.type}
                        type="button"
                        draggable
                        className="flex w-full items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        onDragStart={(event) => {
                            event.stopPropagation();

                            event.dataTransfer.effectAllowed = "copy";

                            event.dataTransfer.setData(
                                "application/x-builder-component",
                                component.type,
                            );
                        }}
                        onClick={() => handleAddComponent(component.type)}
                    >
                        {component.label}
                    </button>
                ))}
            </div>
        </aside>
    );
}