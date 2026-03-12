# GitHub Intelligence MCP Server

An enterprise-grade AI-powered Model Context Protocol (MCP) server for exploring GitHub repositories, issues, commits, and related code.

## 🌟 Overview & Value Proposition

The GitHub Intelligence MCP Server bridges the gap between AI agents and GitHub repositories. By exposing a set of powerful tools via the Model Context Protocol, it enables Large Language Models (LLMs) and AI agents to seamlessly read repository data, analyze issues, find relevant code files, and understand commit histories without leaving their conversational context.

This server is designed for developers, AI engineers, and teams who want to build custom AI workflows, automate issue resolution, and improve codebase understanding through intelligent AI assistants.

## 🏗 Architecture Overview

The server is built using the official `@modelcontextprotocol/sdk` and TypeScript. It acts as an integration layer between an MCP-compatible client (such as AI assistants or the MCP Inspector) and the GitHub REST API.

1. **MCP Client**: Initiates requests (e.g., "Find open issues").
2. **GitHub Intelligence Server**: Validates requests, handles tool routing, and authenticates with GitHub.
3. **GitHub API**: Fetches the required repository data.
4. **Response**: Formats and returns the data back to the AI agent in a structured format for reasoning.

## 🛠 Tool Reference

This MCP server provides the following tools to interact with GitHub:

- **`getRepoInfo`**: Retrieve basic information about a GitHub repository (description, stars, open issues, default branch).
- **`listOpenIssues`**: List the currently open issues in a repository (supports pagination limit).
- **`getIssueByNumber`**: Retrieve detailed information about a specific issue, including its body and status.
- **`findRelatedFilesForIssue`**: (AI Context Tool) Analyzes an issue's content, extracts keywords, and searches the repository to find source code files that are potentially related to the issue.
- **`getRecentCommits`**: Fetch the most recent commits from a repository's default branch.

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A GitHub Personal Access Token (PAT) for API access (optional but recommended for higher rate limits and accessing private repositories).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/meltemeroglu/github-intelligence-mcp.git
   cd github-intelligence-mcp
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## ⚙️ Environment Configuration

To avoid rate limits and access private repositories, you can optionally configure your GitHub Personal Access Token. 

Set the `GITHUB_TOKEN` environment variable before running the server, or configure it in your MCP client's configuration file (e.g., modifying `mcp_config.json` for AI agents).

```bash
export GITHUB_TOKEN="github_pat_your_token_here"
```

## 💡 Usage Examples & Prompts

You can use this MCP server with any compatible MCP client. Here are some example prompts you can use with your AI agents:

**Repository Analysis:**
> "Use the GitHub Intelligence server to tell me about the architecture of `meltemeroglu/github-intelligence-mcp`."

**Issue Investigation:**
> "List the open issues for `meltemeroglu/github-intelligence-mcp`. For issue #3, analyze the description and find the related files in the codebase that I would need to modify to fix it."

**Recent Activity:**
> "What are the latest 5 commits in this repository? Summarize the recent changes."

## 🔄 Example Workflow

**Issue Analysis to Implementation Plan**
1. **AI Agent:** Calls `listOpenIssues` to find tasks.
2. **User:** "Let's work on issue #1."
3. **AI Agent:** Calls `getIssueByNumber` to read the bug description.
4. **AI Agent:** Calls `findRelatedFilesForIssue` to locate the faulty code files.
5. **AI Agent:** Formulates a step-by-step implementation plan and proposes code changes.

## 🤝 Contribution Guidelines

Contributions are welcome! If you're looking to help improve the GitHub Intelligence MCP Server:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please make sure to run tests and follow the existing TypeScript coding style. Open an issue first to discuss major changes.

## 📜 Scripts

- **`npm run dev`**: Run the server in development mode using `tsx`.
- **`npm run build`**: Compile the TypeScript code.
- **`npm start`**: Run the compiled server from `dist`.
