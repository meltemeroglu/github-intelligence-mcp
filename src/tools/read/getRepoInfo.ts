import { z } from "zod";
import { fetchRepo } from "../../services/github.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { auditLog } from "../../utils/audit.js";

export const getRepoInfoConfig = {
    name: "github_get_repository",
    definition: {
        title: "GitHub Get Repository",
        description:
            "Get repository details from GitHub. Use this when the user asks about a GitHub repository.",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
        }),
        type: "read"
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
            name: data.name,
            fullName: data.full_name,
            description: data.description,
            stars: data.stargazers_count,
            forks: data.forks_count,
            language: data.language,
            defaultBranch: data.default_branch,
            url: data.html_url,
        };

        auditLog({
            tool: "github_get_repository",
            status: "success",
            details: { owner, repo },
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