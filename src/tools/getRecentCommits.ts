import { z } from "zod";
import { fetchRecentCommits } from "../services/github.js";

export const getRecentCommitsConfig = {
    name: "get_recent_commits",
    definition: {
        title: "Recent GitHub Commits",
        description: "Get recent commits from a repository",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            limit: z.number().int().positive().optional(),
        }),
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