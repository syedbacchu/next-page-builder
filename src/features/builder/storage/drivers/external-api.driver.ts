import { builderConfig } from "@/features/builder/config/builder.config";
import type {
    BuilderStorageDriver,
    SavePageInput,
    SavePageResult,
    GetPageResult,
    PublishPageResult,
} from "@/features/builder/storage/types";

export class ExternalApiBuilderStorageDriver
    implements BuilderStorageDriver
{
    private readonly config =
        builderConfig.storage.externalApi;

    private buildUrl(endpoint: string): string {
        return `${this.config.baseUrl}${endpoint}`;
    }

    async savePage(
        input: SavePageInput,
    ): Promise<SavePageResult> {
        const response = await fetch(
            this.buildUrl(this.config.saveEndpoint),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            },
        );

        return response.json();
    }

    async getPage(
        pageId: string | number,
    ): Promise<GetPageResult> {
        const response = await fetch(
            `${this.buildUrl(
                this.config.getEndpoint,
            )}/${pageId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        return response.json();
    }

    async publishPage(
        pageId: string | number,
    ): Promise<PublishPageResult> {
        const response = await fetch(
            `${this.buildUrl(
                this.config.publishEndpoint,
            )}/${pageId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        return response.json();
    }
}