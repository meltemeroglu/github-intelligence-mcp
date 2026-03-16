export function approvalRequiredResponse(toolName: string, details?: Record<string, unknown>) {
    return {
        content: [
            {
                type: "text" as const,
                text: JSON.stringify(
                    {
                        success: false,
                        approvalRequired: true,
                        error: `Execution of ${toolName} requires explicit approval`,
                        meta: details ?? {},
                    },
                    null,
                    2
                ),
            },
        ],
        structuredContent: {
            success: false,
            approvalRequired: true,
            error: `Execution of ${toolName} requires explicit approval`,
            meta: details ?? {},
        },
    };
}