export type BuilderStorageDriverName =
    | "next-api"
    | "external-api";

export interface BuilderConfig {
    storage: {
        driver: BuilderStorageDriverName;

        nextApi: {
            baseUrl: string;
            pagesEndpoint: string;
        };

        externalApi: {
            baseUrl: string;
            saveEndpoint: string;
            getEndpoint: string;
            publishEndpoint: string;
        };
    };
}

export const builderConfig: BuilderConfig = {
    storage: {
        // Default storage driver
        driver: "next-api",

        nextApi: {
            baseUrl: "",
            pagesEndpoint: "/api/pages",
        },

        externalApi: {
            baseUrl: "",
            saveEndpoint: "",
            getEndpoint: "",
            publishEndpoint: "",
        },
    },
};