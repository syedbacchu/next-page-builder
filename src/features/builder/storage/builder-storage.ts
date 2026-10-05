import {
    builderConfig,
    type BuilderStorageDriverName,
} from "@/features/builder/config/builder.config";

import { NextApiBuilderStorageDriver } from "@/features/builder/storage/drivers/next-api.driver";
import { ExternalApiBuilderStorageDriver } from "@/features/builder/storage/drivers/external-api.driver";

import type { BuilderStorageDriver } from "@/features/builder/storage/types";

function createStorageDriver(
    driver: BuilderStorageDriverName,
): BuilderStorageDriver {
    switch (driver) {
        case "next-api":
            return new NextApiBuilderStorageDriver();

        case "external-api":
            return new ExternalApiBuilderStorageDriver();

        default:
            throw new Error(
                `Unsupported builder storage driver: ${driver}`,
            );
    }
}

export const builderStorage =
    createStorageDriver(
        builderConfig.storage.driver,
    );