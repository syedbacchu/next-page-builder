"use client";

import { BuilderHistoryToolbar } from "@/features/builder/components/BuilderHistoryToolbar";
import { BuilderViewportSwitcher } from "@/features/builder/components/BuilderViewportSwitcher";
import { useBuilderSave } from "@/features/builder/hooks/use-builder-save";
import { useBuilder } from "@/features/builder/store/BuilderProvider";

export function BuilderHeader() {
    const { state, dispatch } = useBuilder();

    const {
        savePage,
        isSaving,
        isSaved,
        error,
    } = useBuilderSave();

    async function handleSave() {
        const result = await savePage({
            id: state.page.id ?? undefined,
            title: state.page.title,
            slug: state.page.slug,
            content: state.document,
        });

        if (!result.success || !result.data) {
            return;
        }

        dispatch({
            type: "SET_PAGE_META",
            page: {
                id: result.data.id,
                title: result.data.title,
                slug: result.data.slug,
                status: result.data.status,
            },
        });
    }

    return (
        <header className="flex h-14 items-center justify-between border-b bg-white px-4">
            <div>
                <h1 className="text-sm font-semibold text-slate-800">
                    {state.page.title}
                </h1>

                {isSaving && (
                    <p className="text-xs text-slate-400">
                        Saving...
                    </p>
                )}

                {!isSaving && isSaved && (
                    <p className="text-xs text-green-600">
                        Saved
                    </p>
                )}

                {!isSaving && error && (
                    <p className="text-xs text-red-600">
                        {error}
                    </p>
                )}
            </div>

            <BuilderViewportSwitcher />

            <div className="flex items-center gap-2">
                <BuilderHistoryToolbar />

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving
                        ? "Saving..."
                        : "Save"}
                </button>
            </div>
        </header>
    );
}