import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registeredTools } from "./tools/index.js";
import { auditLog } from "./utils/audit.js";
import { canExecuteTool } from "./utils/policy.js";
import { errorResponse } from "./utils/response.js";
import { approvalRequiredResponse } from "./utils/approval.js";

const server = new McpServer({
    name: "github-intelligence-mcp",
    version: "1.0.0",
});

for (const tool of registeredTools) {
    server.registerTool(tool.name, tool.definition, async (args) => {
        const policy = canExecuteTool(tool.name, tool.type);

        auditLog({
            tool: tool.name,
            status: "success",
            details: {
                phase: "policy-check",
                toolType: tool.type,
                allowed: policy.allowed,
                requiresApproval: policy.requiresApproval,
                dryRunOnly: policy.dryRunOnly,
                reason: policy.reason,
            },
        });

        if (!policy.allowed) {
            return errorResponse(`Tool execution denied: ${policy.reason}`, {
                tool: tool.name,
                toolType: tool.type,
            });
        }

        if (tool.type === "write" && policy.requiresApproval) {
            return approvalRequiredResponse(tool.name, {
                toolType: tool.type,
                dryRunOnly: policy.dryRunOnly,
                reason: policy.reason,
            });
        }

        return tool.handler(args);
    });
}


const transport = new StdioServerTransport();
await server.connect(transport);