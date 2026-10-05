"use client";

import { useState } from "react";

import { builderStorage } from "@/features/builder/storage/builder-storage";
import type { SavePageInput } from "@/features/builder/storage/types";

export function useBuilderSave() {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const savePage = async (
        input: SavePageInput,
    ) => {
        setIsSaving(true);
        setIsSaved(false);
        setError(null);

        try {
            const result =
                await builderStorage.savePage(input);

            if (!result.success) {
                setError(
                    result.error_message ||
                    result.message ||
                    "Failed to save page.",
                );

                return result;
            }

            setIsSaved(true);

            return result;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to save page.";

            setError(message);

            return {
                success: false,
                message,
                error_message: message,
            };
        } finally {
            setIsSaving(false);
        }
    };

    return {
        savePage,
        isSaving,
        isSaved,
        error,
    };
}