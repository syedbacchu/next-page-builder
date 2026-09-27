import { NextResponse } from "next/server";

export interface ApiResponseOptions<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error_message?: string;
    errors?: Record<string, string[]>;
    status?: number;
}

export function apiResponse<T = unknown>({
     success,
     message,
     data,
     error_message = "",
     errors = {},
     status = 200,
 }: ApiResponseOptions<T>) {
    return NextResponse.json(
        {
            success,
            message,
            data: data ?? [],
            error_message,
            errors,
            status,
        },
        { status },
    );
}