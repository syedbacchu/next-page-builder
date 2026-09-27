import { prisma } from "@/lib/prisma";
import { apiResponse } from "@/lib/api-response";

export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return apiResponse({
            success: true,
            message: "Database connection is healthy",
            data: [],
            status: 200,
        });
    } catch (error) {
        console.error("Database health check failed:", error);

        return apiResponse({
            success: false,
            message: "Database connection failed",
            error_message: "Unable to connect to database",
            status: 500,
        });
    }
}