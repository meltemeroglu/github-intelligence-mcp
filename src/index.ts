import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import {
    getRepoInfoConfig,
    getRepoInfoHandler,
} from "./tools/getRepoInfo.js";
import {
    getRecentCommitsConfig,
    getRecentCommitsHandler,
} from "./tools/getRecentCommits.js";
import {
    getIssueByNumberConfig,
    getIssueByNumberHandler,
} from "./tools/getIssueByNumber.js";
import {
    listOpenIssuesConfig,
    listOpenIssuesHandler,
} from "./tools/listOpenIssues.js";
import {
    findRelatedFilesForIssueConfig,
    findRelatedFilesForIssueHandler,
} from "./tools/findRelatedFilesForIssue.js";

const server = new McpServer({
    name: "github-intelligence-mcp",
    version: "1.0.0",
});

server.registerTool(
    getRepoInfoConfig.name,
    getRepoInfoConfig.definition,
    getRepoInfoHandler
);

server.registerTool(
    getRecentCommitsConfig.name,
    getRecentCommitsConfig.definition,
    getRecentCommitsHandler
);

server.registerTool(
    getIssueByNumberConfig.name,
    getIssueByNumberConfig.definition,
    getIssueByNumberHandler
);

server.registerTool(
    listOpenIssuesConfig.name,
    listOpenIssuesConfig.definition,
    listOpenIssuesHandler
);

server.registerTool(
    findRelatedFilesForIssueConfig.name,
    findRelatedFilesForIssueConfig.definition,
    findRelatedFilesForIssueHandler
);
const transport = new StdioServerTransport();
await server.connect(transport);