"use client";

import { BuilderHistoryToolbar } from "@/features/builder/components/BuilderHistoryToolbar";
import { BuilderViewportSwitcher } from "@/features/builder/components/BuilderViewportSwitcher";
export function BuilderHeader() {
    return (
        <header className="flex h-14 items-center justify-between border-b bg-white px-4">
            <div className="text-sm font-semibold">
                Page Builder
            </div>
            <BuilderViewportSwitcher />
            <BuilderHistoryToolbar />
        </header>
    );
}