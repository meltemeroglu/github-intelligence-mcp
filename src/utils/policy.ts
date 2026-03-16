import type { ToolType } from "../tools/index.js";

export type ToolPolicyResult = {
    allowed: boolean;
    requiresApproval: boolean;
    dryRunOnly: boolean;
    reason: string;
};

export function canExecuteTool(toolName: string, toolType: ToolType): ToolPolicyResult {
    if (toolType === "read") {
        return {
            allowed: true,
            requiresApproval: false,
            dryRunOnly: false,
            reason: "Read tools are allowed by default",
        };
    }

    const writesEnabled = process.env.ENABLE_WRITE_TOOLS === "true";
    const approvalRequired = process.env.REQUIRE_WRITE_APPROVAL !== "false";
    const dryRunMode = process.env.WRITE_TOOLS_DRY_RUN !== "false";

    if (!writesEnabled) {
        return {
            allowed: false,
            requiresApproval: approvalRequired,
            dryRunOnly: true,
            reason: "Write tools are disabled by policy",
        };
    }

    return {
        allowed: true,
        requiresApproval: approvalRequired,
        dryRunOnly: dryRunMode,
        reason: dryRunMode
            ? "Write tools are allowed in dry-run mode only"
            : "Write tools are allowed",
    };
}