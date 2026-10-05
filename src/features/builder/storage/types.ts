import type { BuilderDocument } from "@/features/builder/types/builder.types";

export interface SavePageInput {
    id?: number;
    title: string;
    slug: string;
    content: BuilderDocument;
}

export interface SavedPage {
    id: number;
    title: string;
    slug: string;
    content: BuilderDocument;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface SavePageResult {
    success: boolean;
    message: string;
    data?: SavedPage;
    error_message?: string;
}

export interface GetPageResult {
    success: boolean;
    message: string;
    data?: SavedPage;
    error_message?: string;
}

export interface PublishPageResult {
    success: boolean;
    message: string;
    data?: SavedPage;
    error_message?: string;
}

export interface BuilderStorageDriver {
    savePage(
        input: SavePageInput,
    ): Promise<SavePageResult>;

    getPage(
        pageId: string | number,
    ): Promise<GetPageResult>;

    publishPage(
        pageId: string | number,
    ): Promise<PublishPageResult>;
}