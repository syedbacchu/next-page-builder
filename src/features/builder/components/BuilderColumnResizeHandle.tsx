"use client";

import { useEffect, useRef } from "react";

interface BuilderColumnResizeHandleProps {
    onResizeStart: (
        event: React.MouseEvent<HTMLDivElement>,
    ) => void;

    onResizeMove?: (
        clientX: number,
    ) => void;

    onResizeEnd?: () => void;
}

export function BuilderColumnResizeHandle({
                                              onResizeStart,
                                              onResizeMove,
                                              onResizeEnd,
                                          }: BuilderColumnResizeHandleProps) {
    const isDragging = useRef(false);

    useEffect(() => {
        function handleMouseMove(event: MouseEvent) {
            if (!isDragging.current) {
                return;
            }

            onResizeMove?.(event.clientX);
        }

        function handleMouseUp() {
            if (!isDragging.current) {
                return;
            }

            isDragging.current = false;

            document.body.style.cursor = "";
            document.body.style.userSelect = "";

            onResizeEnd?.();
        }

        window.addEventListener(
            "mousemove",
            handleMouseMove,
        );

        window.addEventListener(
            "mouseup",
            handleMouseUp,
        );

        return () => {
            window.removeEventListener(
                "mousemove",
                handleMouseMove,
            );

            window.removeEventListener(
                "mouseup",
                handleMouseUp,
            );

            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [
        onResizeMove,
        onResizeEnd,
    ]);

    function handleMouseDown(
        event: React.MouseEvent<HTMLDivElement>,
    ) {
        event.preventDefault();
        event.stopPropagation();

        isDragging.current = true;

        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        onResizeStart(event);
    }

    return (
        <div
            className={[
                "absolute right-0 top-1/2 z-[9999]",
                "-translate-y-1/2 translate-x-1/2",
                "flex h-8 w-3 cursor-col-resize",
                "items-center justify-center",
                "rounded-full border border-slate-300",
                "bg-white shadow-sm",
            ].join(" ")}
            onMouseDown={handleMouseDown}
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            <span className="h-4 w-0.5 rounded-full bg-slate-400" />
        </div>
    );
}