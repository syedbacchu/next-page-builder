import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { CreatePageInput } from "@/lib/validation/page.schema";

export async function createPage(input: CreatePageInput) {
    return prisma.page.create({
        data: {
            title: input.title,
            slug: input.slug,
            content: input.content as Prisma.InputJsonValue,
        },
    });
}

export async function updatePage(
    id: number,
    input: CreatePageInput,
) {
    return prisma.page.update({
        where: {
            id,
        },
        data: {
            title: input.title,
            slug: input.slug,
            content: input.content as Prisma.InputJsonValue,
        },
    });
}

export async function getPageById(id: number) {
    return prisma.page.findUnique({
        where: {
            id,
        },
    });
}

export async function publishPage(id: number) {
    return prisma.page.update({
        where: {
            id,
        },
        data: {
            status: "published",
        },
    });
}