const GITHUB_API_BASE = "https://api.github.com";

function getHeaders() {
    return {
        Accept: "application/vnd.github+json",
        "User-Agent": "github-intelligence-mcp",
    };
}

export async function fetchRepo(owner: string, repo: string) {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Repo request failed. Status: ${response.status}`);
    }

    return response.json();
}

export async function fetchRecentCommits(
    owner: string,
    repo: string,
    limit: number
) {
    const response = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=${limit}`,
        {
            headers: getHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(`Commits request failed. Status: ${response.status}`);
    }

    return response.json();
}

export async function fetchIssueByNumber(
    owner: string,
    repo: string,
    issueNumber: number
) {
    const response = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}`,
        {
            headers: getHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(`Issue request failed. Status: ${response.status}`);
    }

    return response.json();
}

export async function fetchOpenIssues(owner: string, repo: string) {
    const response = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=open&per_page=20`,
        {
            headers: getHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(`Issues request failed. Status: ${response.status}`);
    }

    return response.json();
}