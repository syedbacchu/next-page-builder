import { prisma } from "@/lib/prisma";
import type { CreatePageInput } from "@/lib/validation/page.schema";
import type { Prisma } from "@/generated/prisma/client";

export async function createPage(input: CreatePageInput) {
    return prisma.page.create({
        data: {
            title: input.title,
            slug: input.slug,
            content: input.content as Prisma.InputJsonValue,
        },
    });
}