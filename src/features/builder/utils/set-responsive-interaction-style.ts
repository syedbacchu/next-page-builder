import type {
    BuilderInteractionStyles,
    BuilderResponsiveStyles,
} from "@/features/builder/types/builder.types";

import type { BuilderViewport } from "@/features/builder/types/builder-viewport.types";

export function setResponsiveInteractionStyle(
    interactions: BuilderInteractionStyles | undefined,
    interaction: "hover",
    viewport: BuilderViewport,
    key: string,
    value: string,
): BuilderInteractionStyles {
    const existing =
        interactions ?? {};

    const existingInteraction =
        existing[interaction] ?? {};

    return {
        ...existing,

        [interaction]: {
            ...existingInteraction,

            desktop:
                existingInteraction.desktop ?? {},

            tablet:
                existingInteraction.tablet ?? {},

            mobile:
                existingInteraction.mobile ?? {},

            [viewport]: {
                ...(existingInteraction[viewport] ?? {}),
                [key]: value,
            },
        } satisfies BuilderResponsiveStyles,
    };
}