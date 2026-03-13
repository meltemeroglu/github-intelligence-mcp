import { z } from "zod"
import { fetchIssueByNumber } from "../../services/github.js"
import { successResponse, errorResponse } from "../../utils/response.js"
import { auditLog } from "../../utils/audit.js"

export const findRelatedFilesForIssueConfig = {
    name: "github_find_related_files_for_issue",
    type: "read",
    definition: {
        title: "GitHub Find Related Files For Issue",
        description:
            "Find potentially related source files for a GitHub issue by analyzing issue title and description keywords.",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            issueNumber: z.number().int().positive(),
        }),
    },
}

export async function findRelatedFilesForIssueHandler({
    owner,
    repo,
    issueNumber,
}: {
    owner: string
    repo: string
    issueNumber: number
}) {
    try {
        const issue = await fetchIssueByNumber(owner, repo, issueNumber)

        const text = `${issue.title} ${issue.body ?? ""}`.toLowerCase()

        const keywords = text
            .split(/\W+/)
            .filter((w: string) => w.length > 4)
            .slice(0, 5)

        const possibleAreas = keywords.map((k: string) => `search:${k}`)

        const result = {
            issueTitle: issue.title,
            keywords,
            searchSuggestions: possibleAreas,
        }

        auditLog({
            tool: "github_find_related_files_for_issue",
            status: "success",
            details: { owner, repo, issueNumber },
        })

        return successResponse(result)
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Unknown related files error"

        auditLog({
            tool: "github_find_related_files_for_issue",
            status: "error",
            details: { owner, repo, issueNumber, message },
        })

        return errorResponse(message)
    }
}