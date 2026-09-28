"use client";

import { useEffect } from "react";
import { useBuilder } from "@/features/builder/store/BuilderProvider";

export function BuilderKeyboardShortcuts() {
    const { dispatch } = useBuilder();

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const isModifierPressed =
                event.ctrlKey || event.metaKey;

            if (!isModifierPressed) {
                return;
            }

            if (event.key.toLowerCase() === "z") {
                event.preventDefault();

                if (event.shiftKey) {
                    dispatch({
                        type: "REDO",
                    });
                } else {
                    dispatch({
                        type: "UNDO",
                    });
                }
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [dispatch]);

    return null;
}