# GitHub Intelligence MCP Server

An AI-powered Model Context Protocol (MCP) server for exploring GitHub repositories, issues, commits, and related code.

## Features

This MCP server provides the following tools to interact with GitHub:

- **`getRepoInfo`**: Retrieve basic information about a GitHub repository.
- **`getRecentCommits`**: Fetch the most recent commits from a repository.
- **`getIssueByNumber`**: Retrieve details of a specific issue by its number.
- **`listOpenIssues`**: List the currently open issues in a repository.
- **`findRelatedFilesForIssue`**: Find files in the repository that are potentially related to a specific issue.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Installation

1. Clone the repository or navigate to the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```

## Scripts

- **`npm run dev`**: Run the server in development mode using `tsx`.
- **`npm run build`**: Compile the TypeScript code to JavaScript.
- **`npm start`**: Run the compiled server from the `dist` directory.

## Usage

You can use this MCP server with any compatible MCP client (like the Model Context Protocol Inspector or AI assistants that support MCP). 

To test the server using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

*(Note: Make sure to build the project with `npm run build` first before running the compiled script in `dist`)*
