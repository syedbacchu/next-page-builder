"use client";

import type { DragEvent } from "react";

interface BuilderColumnDropZoneProps {
    columnId: string;
    onDragOver: (event: DragEvent<HTMLDivElement>) => void;
    onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

export function BuilderColumnDropZone({
                                          columnId,
                                          onDragOver,
                                          onDrop,
                                      }: BuilderColumnDropZoneProps) {
    return (
        <div
            data-builder-column-drop-zone={columnId}
            className="min-h-8 w-full"
            onDragOver={onDragOver}
            onDrop={onDrop}
        />
    );
}