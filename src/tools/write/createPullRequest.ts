import { z } from "zod";
import { createPullRequest } from "../../services/github.js";
import {
    successResponse,
    errorResponse,
    dryRunResponse,
} from "../../utils/response.js";
import { auditLog } from "../../utils/audit.js";

export const createPullRequestConfig = {
    name: "github_create_pull_request",
    type: "write",
    definition: {
        title: "GitHub Create Pull Request",
        description:
            "Create a GitHub pull request from an existing branch. Use this only after code changes are committed and pushed to GitHub.",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            title: z.string().min(1),
            body: z.string().optional(),
            head: z.string().min(1),
            base: z.string().min(1).default("main"),
            approved: z.boolean().optional(),
        }),
    },
};

export async function createPullRequestHandler({
    owner,
    repo,
    title,
    body,
    head,
    base,
    approved,
}: {
    owner: string;
    repo: string;
    title: string;
    body?: string;
    head: string;
    base: string;
    approved?: boolean;
}) {
    try {
        const dryRunMode = process.env.WRITE_TOOLS_DRY_RUN !== "false";

        const plannedAction = {
            owner,
            repo,
            title,
            body: body ?? "",
            head,
            base,
        };

        if (dryRunMode || approved !== true) {
            auditLog({
                tool: "github_create_pull_request",
                status: "success",
                details: {
                    phase: "dry-run",
                    owner,
                    repo,
                    head,
                    base,
                    title,
                },
            });

            return dryRunResponse("github_create_pull_request", plannedAction, {
                operationType: "write",
                requiresApproval: true,
            });
        }

        const pr = await createPullRequest(
            owner,
            repo,
            title,
            body ?? "",
            head,
            base
        );

        const result = {
            number: pr.number,
            title: pr.title,
            state: pr.state,
            url: pr.html_url,
            head: pr.head?.ref ?? head,
            base: pr.base?.ref ?? base,
        };

        auditLog({
            tool: "github_create_pull_request",
            status: "success",
            details: {
                phase: "executed",
                owner,
                repo,
                head,
                base,
                title,
            },
        });

        return successResponse(result, {
            operationType: "write",
            executed: true,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown create PR error";

        auditLog({
            tool: "github_create_pull_request",
            status: "error",
            details: {
                owner,
                repo,
                head,
                base,
                title,
                message,
            },
        });

        return errorResponse(message, {
            operationType: "write",
        });
    }
}