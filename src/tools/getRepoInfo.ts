import { z } from "zod";
import { fetchRepo } from "../services/github.js";

export const getRepoInfoConfig = {
    name: "get_repo_info",
    definition: {
        title: "GitHub Repo Info",
        description: "Get basic information about a GitHub repository",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
        }),
    },
};

export async function getRepoInfoHandler({
    owner,
    repo,
}: {
    owner: string;
    repo: string;
}) {
    try {
        const data = await fetchRepo(owner, repo);

        const result = {
            success: true,
            repo: {
                name: data.name,
                fullName: data.full_name,
                description: data.description,
                stars: data.stargazers_count,
                forks: data.forks_count,
                language: data.language,
                url: data.html_url,
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