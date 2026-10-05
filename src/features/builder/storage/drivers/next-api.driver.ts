import { builderConfig } from "@/features/builder/config/builder.config";
import type {
    BuilderStorageDriver,
    SavePageInput,
    SavePageResult,
    GetPageResult,
    PublishPageResult,
} from "@/features/builder/storage/types";

export class NextApiBuilderStorageDriver
    implements BuilderStorageDriver
{
    private readonly baseUrl =
        builderConfig.storage.nextApi.baseUrl;

    private readonly pagesEndpoint =
        builderConfig.storage.nextApi.pagesEndpoint;

    async savePage(
        input: SavePageInput,
    ): Promise<SavePageResult> {
        try {
            const response = await fetch(
                `${this.baseUrl}${this.pagesEndpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(input),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message:
                        result?.message ??
                        "Failed to save page.",
                    error_message:
                        result?.error_message ?? "",
                };
            }

            return result;
        } catch (error) {
            return {
                success: false,
                message: "Failed to save page.",
                error_message:
                    error instanceof Error
                        ? error.message
                        : "Unknown error.",
            };
        }
    }

    async getPage(
        pageId: string | number,
    ): Promise<GetPageResult> {
        try {
            const response = await fetch(
                `${this.baseUrl}${this.pagesEndpoint}/${pageId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message:
                        result?.message ??
                        "Failed to load page.",
                    error_message:
                        result?.error_message ?? "",
                };
            }

            return result;
        } catch (error) {
            return {
                success: false,
                message: "Failed to load page.",
                error_message:
                    error instanceof Error
                        ? error.message
                        : "Unknown error.",
            };
        }
    }

    async publishPage(
        pageId: string | number,
    ): Promise<PublishPageResult> {
        try {
            const response = await fetch(
                `${this.baseUrl}${this.pagesEndpoint}/${pageId}/publish`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message:
                        result?.message ??
                        "Failed to publish page.",
                    error_message:
                        result?.error_message ?? "",
                };
            }

            return result;
        } catch (error) {
            return {
                success: false,
                message: "Failed to publish page.",
                error_message:
                    error instanceof Error
                        ? error.message
                        : "Unknown error.",
            };
        }
    }
}