import { z } from "zod";

export const createPageSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(200, "Title must not exceed 200 characters"),

    slug: z
        .string()
        .trim()
        .min(1, "Slug is required")
        .max(200, "Slug must not exceed 200 characters")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers, and hyphens",
        ),

    content: z
        .record(z.string(), z.unknown())
        .default({}),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;