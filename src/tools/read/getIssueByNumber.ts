import { z } from "zod";
import { fetchIssueByNumber } from "../../services/github.js";
import { auditLog } from "../../utils/audit.js";
import { errorResponse, successResponse } from "../../utils/response.js";

export const getIssueByNumberConfig = {
    name: "get_github_issue_by_number",
    definition: {
        title: "Get GitHub Issue By Number",
        description: "Get a GitHub issue by its number. Use this when the user asks about a GitHub issue.",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            issueNumber: z.number().int().positive(),
        }),
        type: "read"
    },
};


export async function getIssueByNumberHandler({
    owner,
    repo,
    issueNumber,
}: {
    owner: string;
    repo: string;
    issueNumber: number;
}) {
    try {
        const issue = await fetchIssueByNumber(owner, repo, issueNumber);

        const result = {
            success: true,
            issue: {
                number: issue.number,
                title: issue.title,
                body: issue.body,
                state: issue.state,
                author: issue.user?.login ?? null,
                comments: issue.comments,
                createdAt: issue.created_at,
                updatedAt: issue.updated_at,
                url: issue.html_url,
                labels: (issue.labels ?? []).map((label: any) =>
                    typeof label === "string" ? label : label.name
                ),
                isPullRequest: Boolean(issue.pull_request),
            },
        };

        auditLog({
            tool: "get_github_issue_by_number",
            status: "success",
            details: { owner, repo, issueNumber },
        });

        return successResponse(result);

    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown repository error";

        auditLog({
            tool: "github_get_repository",
            status: "error",
            details: { owner, repo, message },
        });

        return errorResponse(message);
    }
}