"use client";

import {
    createContext,
    useContext,
    useReducer,
    type ReactNode,
} from "react";

import {
    builderReducer,
    createInitialBuilderState
} from "@/features/builder/store/builder.store";
import type {
    BuilderState,
    BuilderAction,
} from "@/features/builder/store/builder.types";

import type { BuilderDocument } from "@/features/builder/types/builder.types";

interface BuilderContextValue {
    state: BuilderState;
    dispatch: React.Dispatch<BuilderAction>;
}

const BuilderContext =
    createContext<BuilderContextValue | null>(null);

interface BuilderProviderProps {
    document: BuilderDocument;

    page?: {
        id?: number | null;
        title?: string;
        slug?: string;
        status?: string;
    };

    children: ReactNode;
}

export function BuilderProvider({
                                    document,
                                    page,
                                    children,
                                }: BuilderProviderProps) {
    const [state, dispatch] = useReducer(
        builderReducer,
        document,
        createInitialBuilderState,
    );

    return (
        <BuilderContext.Provider
            value={{ state, dispatch }}
        >
            {children}
        </BuilderContext.Provider>
    );
}

export function useBuilder() {
    const context = useContext(BuilderContext);

    if (!context) {
        throw new Error(
            "useBuilder must be used inside BuilderProvider",
        );
    }

    return context;
}