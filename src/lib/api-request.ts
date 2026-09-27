import { NextRequest } from "next/server";
import { z } from "zod";

import { apiResponse } from "@/lib/api-response";

interface ParseResult<T> {
    success: true;
    data: T;
}

interface ParseError {
    success: false;
    response: Response;
}

export type ApiRequestResult<T> = ParseResult<T> | ParseError;

export async function parseJsonBody<TSchema extends z.ZodType>(
    request: NextRequest,
    schema: TSchema,
): Promise<ApiRequestResult<z.output<TSchema>>> {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return {
            success: false,
            response: apiResponse({
                success: false,
                message: "Invalid request body",
                error_message: "Request body must contain valid JSON",
                status: 400,
            }),
        };
    }

    const result = schema.safeParse(body);

    if (!result.success) {
        const errors: Record<string, string[]> = {};

        for (const issue of result.error.issues) {
            const field = issue.path[0];

            if (typeof field !== "string") {
                continue;
            }

            if (!errors[field]) {
                errors[field] = [];
            }

            errors[field].push(issue.message);
        }

        const firstError = result.error.issues[0]?.message ?? "Validation failed";

        return {
            success: false,
            response: apiResponse({
                success: false,
                message: firstError,
                error_message: "Please fix the validation errors",
                errors,
                status: 422,
            }),
        };
    }

    return {
        success: true,
        data: result.data,
    };
}