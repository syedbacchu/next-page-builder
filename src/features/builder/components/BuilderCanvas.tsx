"use client";

import { useBuilder } from "@/features/builder/store/BuilderProvider";
import { BuilderRenderer } from "@/features/builder/components/BuilderRenderer";

export function BuilderCanvas() {
    const { state } = useBuilder();

    return (
        <main className="min-w-0 flex-1">
            <BuilderRenderer node={state.document} />
        </main>
    );
}