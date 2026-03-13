import { z } from "zod";
import { fetchOpenIssues } from "../../services/github.js";
import { errorResponse, successResponse } from "../../utils/response.js";
import { auditLog } from "../../utils/audit.js";

export const listOpenIssuesConfig = {
    name: "github_list_open_issues",
    definition: {
        title: "List Open GitHub Issues",
        description: "List open issues of a GitHub repository",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            limit: z.number().int().positive().optional(),
        }),
        type: "read"
    },
};

export async function listOpenIssuesHandler({
    owner,
    repo,
    limit,
}: {
    owner: string;
    repo: string;
    limit?: number;
}) {
    try {
        const issueLimit = limit ?? 5;
        const issues = await fetchOpenIssues(owner, repo);

        const items = issues
            .filter((issue: any) => !issue.pull_request)
            .slice(0, issueLimit)
            .map((issue: any) => ({
                number: issue.number,
                title: issue.title,
                author: issue.user?.login ?? null,
                state: issue.state,
                comments: issue.comments,
                createdAt: issue.created_at,
                updatedAt: issue.updated_at,
                url: issue.html_url,
                labels: (issue.labels ?? []).map((label: any) =>
                    typeof label === "string" ? label : label.name
                ),
            }));

        const result = {
            success: true,
            requestedLimit: issueLimit,
            returnedCount: items.length,
            issues: items,
        };

        auditLog({
            tool: "github_list_open_issues",
            status: "success",
            details: { owner, repo, limit },
        });

        return successResponse(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown repository error";

        auditLog({
            tool: "github_list_open_issues",
            status: "error",
            details: { owner, repo, limit, message },
        });

        return errorResponse(message);
    }

}