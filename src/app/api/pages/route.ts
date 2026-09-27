import { NextRequest } from "next/server";

import { apiResponse } from "@/lib/api-response";
import { parseJsonBody } from "@/lib/api-request";
import { createPageSchema } from "@/lib/validation/page.schema";
import { createPage } from "@/features/pages/page.service";

export async function POST(request: NextRequest) {
    try {
        const result = await parseJsonBody(request, createPageSchema);

        if (!result.success) {
            return result.response;
        }

        const page = await createPage(result.data);

        return apiResponse({
            success: true,
            message: "Page created successfully",
            data: page,
            status: 201,
        });
    } catch (error) {
        console.error("Create page error:", error);

        return apiResponse({
            success: false,
            message: "Failed to create page",
            error_message: "An unexpected error occurred",
            status: 500,
        });
    }
}