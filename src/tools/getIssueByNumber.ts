import { z } from "zod";
import { fetchIssueByNumber } from "../services/github.js";

export const getIssueByNumberConfig = {
    name: "get_issue_by_number",
    definition: {
        title: "Get GitHub Issue By Number",
        description: "Get a GitHub issue by its number",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            issueNumber: z.number().int().positive(),
        }),
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

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(result, null, 2),
                },
            ],
            structuredContent: result,
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: error instanceof Error ? error.message : "Unknown error",
                },
            ],
            structuredContent: {
                success: false,
            },
        };
    }
}