import { z } from "zod";
import {
    getRepoInfoConfig,
    getRepoInfoHandler,
} from "./read/getRepoInfo.js";
import {
    getRecentCommitsConfig,
    getRecentCommitsHandler,
} from "./read/getRecentCommits.js";
import {
    getIssueByNumberConfig,
    getIssueByNumberHandler,
} from "./read/getIssueByNumber.js";
import {
    listOpenIssuesConfig,
    listOpenIssuesHandler,
} from "./read/listOpenIssues.js";
import {
    findRelatedFilesForIssueConfig,
    findRelatedFilesForIssueHandler,
} from "./read/findRelatedFilesForIssue.js";
import {
    createPullRequestConfig,
    createPullRequestHandler,
} from "./write/createPullRequest.js";


export type ToolType = "read" | "write";

export type RegisteredTool = {
    name: string;
    type: ToolType;
    definition: {
        title: string;
        description: string;
        inputSchema: z.ZodTypeAny;
    };
    handler: (args: any) => Promise<any>;
};

export const registeredTools: RegisteredTool[] = [
    {
        ...getRepoInfoConfig,
        type: "read",
        handler: getRepoInfoHandler,
    },
    {
        ...getRecentCommitsConfig,
        type: "read",
        handler: getRecentCommitsHandler,
    },
    {
        ...getIssueByNumberConfig,
        type: "read",
        handler: getIssueByNumberHandler,
    },
    {
        ...listOpenIssuesConfig,
        type: "read",
        handler: listOpenIssuesHandler,
    },
    {
        ...findRelatedFilesForIssueConfig,
        type: "read",
        handler: findRelatedFilesForIssueHandler,
    },
    {
        ...createPullRequestConfig,
        type: "write",
        handler: createPullRequestHandler,
    },
];