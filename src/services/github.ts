const GITHUB_API_BASE = "https://api.github.com";

function getHeaders() {
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "User-Agent": "github-intelligence-mcp",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs = 10000
) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        return response;
    } finally {
        clearTimeout(timeout);
    }
}

async function handleResponse(response: Response) {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`GitHub API error ${response.status}: ${text}`);
    }

    return response.json();
}

export async function fetchRepo(owner: string, repo: string) {
    const response = await fetchWithTimeout(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
        {
            headers: getHeaders(),
        }
    );

    return handleResponse(response);
}

export async function fetchRecentCommits(
    owner: string,
    repo: string,
    limit: number
) {
    const response = await fetchWithTimeout(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=${limit}`,
        {
            headers: getHeaders(),
        }
    );

    return handleResponse(response);
}

export async function fetchIssueByNumber(
    owner: string,
    repo: string,
    issueNumber: number
) {
    const response = await fetchWithTimeout(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}`,
        {
            headers: getHeaders(),
        }
    );

    return handleResponse(response);
}

export async function fetchOpenIssues(owner: string, repo: string) {
    const response = await fetchWithTimeout(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=open&per_page=20`,
        {
            headers: getHeaders(),
        }
    );

    return handleResponse(response);
}

export async function createPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string,
    head: string,
    base: string
) {
    if (!process.env.GITHUB_TOKEN) {
        throw new Error("GitHub token is required to create a pull request");
    }

    const response = await fetchWithTimeout(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls`,
        {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                title,
                body,
                head,
                base,
            }),
        }
    );

    return handleResponse(response);
}