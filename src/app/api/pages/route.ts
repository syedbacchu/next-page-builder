import { NextRequest } from "next/server";

import { apiResponse } from "@/lib/api-response";
import { parseJsonBody } from "@/lib/api-request";
import { createPageSchema } from "@/lib/validation/page.schema";

import {
    createPage,
    updatePage,
} from "@/features/pages/page.service";

export async function POST(request: NextRequest) {
    try {
        const result = await parseJsonBody(
            request,
            createPageSchema,
        );

        if (!result.success) {
            return result.response;
        }

        const page = result.data.id
            ? await updatePage(
                result.data.id,
                result.data,
            )
            : await createPage(result.data);

        return apiResponse({
            success: true,
            message: result.data.id
                ? "Page updated successfully"
                : "Page created successfully",
            data: page,
            status: result.data.id ? 200 : 201,
        });
    } catch (error) {
        console.error("Save page error:", error);

        return apiResponse({
            success: false,
            message: "Failed to save page",
            error_message:
                "An unexpected error occurred",
            status: 500,
        });
    }
}