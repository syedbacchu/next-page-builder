"use client";

import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { BuilderRenderer } from "@/features/builder/components/BuilderRenderer";
import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";

export function BuilderCanvas() {
    const { state } = useBuilder();

    const viewportWidth: Record<BuilderViewport, string> = {
        desktop: "w-full",
        tablet: "w-[768px]",
        mobile: "w-[375px]",
    };

    return (
        <main className="min-w-0 flex-1 overflow-auto bg-slate-100 p-6">
            <div className="flex min-h-full justify-center">
                <div
                    className={[
                        "min-h-[calc(100vh-100px)]",
                        "rounded-lg border border-slate-200",
                        "bg-white shadow-sm",
                        "transition-all duration-200",
                        viewportWidth[state.viewport],
                    ].join(" ")}
                >
                    <BuilderRenderer node={state.document} />
                </div>
            </div>
        </main>
    );
}