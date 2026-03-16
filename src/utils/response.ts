export function successResponse<T>(data: T, meta?: Record<string, unknown>) {
    return {
        content: [
            {
                type: "text" as const,
                text: JSON.stringify(
                    {
                        success: true,
                        data,
                        meta: meta ?? {},
                    },
                    null,
                    2
                ),
            },
        ],
        structuredContent: {
            success: true,
            data,
            meta: meta ?? {},
        },
    };
}

export function errorResponse(message: string, meta?: Record<string, unknown>) {
    return {
        content: [
            {
                type: "text" as const,
                text: JSON.stringify(
                    {
                        success: false,
                        error: message,
                        meta: meta ?? {},
                    },
                    null,
                    2
                ),
            },
        ],
        structuredContent: {
            success: false,
            error: message,
            meta: meta ?? {},
        },
    };
}

export function dryRunResponse<T>(
    action: string,
    data: T,
    meta?: Record<string, unknown>
) {
    return {
        content: [
            {
                type: "text" as const,
                text: JSON.stringify(
                    {
                        success: true,
                        dryRun: true,
                        action,
                        data,
                        meta: meta ?? {},
                    },
                    null,
                    2
                ),
            },
        ],
        structuredContent: {
            success: true,
            dryRun: true,
            action,
            data,
            meta: meta ?? {},
        },
    };
}