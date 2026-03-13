export function auditLog(event: {
    tool: string
    status: "success" | "error"
    details?: Record<string, unknown>
}) {
    const log = {
        timestamp: new Date().toISOString(),
        service: "github-intelligence-mcp",
        ...event,
    }

    console.error(JSON.stringify(log))
}