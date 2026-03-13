import { z } from "zod";
import { fetchRecentCommits } from "../../services/github.js";
import { errorResponse, successResponse } from "../../utils/response.js";
import { auditLog } from "../../utils/audit.js";

export const getRecentCommitsConfig = {
    name: "get_github_repo_recent_commits",
    definition: {
        title: "Get GitHub Repository Recent Commits",
        description: "Get recent commits from a GitHub repository",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            limit: z.number().int().positive().optional(),
        }),
        type: "read"
    },
};

export async function getRecentCommitsHandler({
    owner,
    repo,
    limit,
}: {
    owner: string;
    repo: string;
    limit?: number;
}) {
    try {
        const commitLimit = limit ?? 5;
        const commits = await fetchRecentCommits(owner, repo, commitLimit);

        const items = commits.slice(0, commitLimit).map((c: any) => ({
            message: c.commit.message,
            author: c.author?.login ?? c.commit.author.name,
            gitAuthor: c.commit.author.name,
            date: c.commit.author.date,
            url: c.html_url,
        }));

        const result = {
            success: true,
            count: items.length,
            commits: items,
        };

        auditLog({
            tool: "get_github_repo_recent_commits",
            status: "success",
            details: { owner, repo, limit },
        });

        return successResponse(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown repository error";

        auditLog({
            tool: "get_github_repo_recent_commits",
            status: "error",
            details: { owner, repo, limit, message },
        });

        return errorResponse(message);
    }
}