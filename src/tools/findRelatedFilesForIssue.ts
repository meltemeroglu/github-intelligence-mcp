import { z } from "zod";
import { fetchIssueByNumber } from "../services/github.js";

function extractKeywords(text: string): string[] {
    const stopWords = new Set([
        "the", "a", "an", "and", "or", "but", "if", "then", "is", "are", "was", "were",
        "to", "from", "of", "in", "on", "at", "by", "for", "with", "this", "that", "it"
    ]);

    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9_\- ]/gi, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3)
        .filter((w) => !stopWords.has(w));

    const frequency = new Map<string, number>();

    for (const word of words) {
        frequency.set(word, (frequency.get(word) ?? 0) + 1);
    }

    return [...frequency.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word);
}

async function searchCode(owner: string, repo: string, query: string) {
    const response = await fetch(
        `https://api.github.com/search/code?q=${encodeURIComponent(query)}+repo:${owner}/${repo}`,
        {
            headers: {
                Accept: "application/vnd.github+json",
                "User-Agent": "github-intelligence-mcp",
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Code search failed: ${response.status}`);
    }

    return response.json();
}

export const findRelatedFilesForIssueConfig = {
    name: "find_related_files_for_issue",
    definition: {
        title: "Find Related Files For Issue",
        description: "Find repository files likely related to a GitHub issue",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            issueNumber: z.number().int().positive(),
        }),
    },
};

export async function findRelatedFilesForIssueHandler({
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

        const text = `${issue.title} ${issue.body ?? ""}`;

        const keywords = extractKeywords(text);

        const files: any[] = [];

        for (const keyword of keywords.slice(0, 3)) {
            const result = await searchCode(owner, repo, keyword);

            const items = result.items ?? [];

            for (const item of items.slice(0, 3)) {
                files.push({
                    keyword,
                    file: item.name,
                    path: item.path,
                    url: item.html_url,
                });
            }
        }

        const uniqueFiles = Array.from(
            new Map(files.map((f) => [f.path, f])).values()
        ).slice(0, 8);

        const response = {
            success: true,
            issue: {
                number: issue.number,
                title: issue.title,
            },
            keywords,
            relatedFiles: uniqueFiles,
        };

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(response, null, 2),
                },
            ],
            structuredContent: response,
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