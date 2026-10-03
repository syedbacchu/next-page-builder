"use client";

import type { DragEvent } from "react";

interface BuilderColumnDropZoneProps {
    columnId: string;
    empty?: boolean;
    onDragOver: (event: DragEvent<HTMLDivElement>) => void;
    onDrop: (event: DragEvent<HTMLDivElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export function BuilderColumnDropZone({
                                          columnId,
                                          empty = false,
                                          onDragOver,
                                          onDrop,
                                          onClick,
                                      }: BuilderColumnDropZoneProps) {
    return (
        <div
            data-builder-column-drop-zone={columnId}
            className={[
                "w-full",
                empty
                    ? [
                        "flex min-h-[120px]",
                        "items-center justify-center",
                        "rounded-md border-2 border-dashed",
                        "border-slate-200",
                        "bg-slate-50/50",
                        "p-6",
                        "transition-colors",
                        "hover:border-blue-400",
                        "hover:bg-blue-50/30",
                    ].join(" ")
                    : "min-h-10",
            ].join(" ")}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={onClick}
        >
            {empty && (
                <div className="pointer-events-none text-center">
                    <div
                        className={[
                            "mx-auto mb-3 flex h-10 w-10",
                            "items-center justify-center",
                            "rounded-full",
                            "border border-dashed",
                            "border-slate-300",
                            "bg-white",
                            "text-xl text-slate-400",
                        ].join(" ")}
                    >
                        +
                    </div>

                    <p className="text-sm font-semibold text-slate-600">
                        Add Element
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Drag an element here
                    </p>
                </div>
            )}
        </div>
    );
}