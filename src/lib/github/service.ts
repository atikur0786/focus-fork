import { Octokit } from "octokit";

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    clone_url: string;
    default_branch: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    owner: {
        login: string;
        id: number;
        type: string;
    };
}

export interface GitHubFile {
    name: string;
    path: string;
    type: "file" | "dir" | "submodule" | "symlink";
    size: number | null;
    url: string;
    html_url: string | null;
    download_url: string | null;
    git_url: string | null;
    sha: string;
}

export interface GitHubFileContent {
    name: string;
    path: string;
    content: string;
    sha: string;
    size: number;
    type: string;
}

export interface GitHubBranch {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
    protected: boolean;
}

export interface GitHubPullRequest {
    id: number;
    number: number;
    title: string;
    body: string | null;
    html_url: string;
    state: "open" | "closed" | "merged";
    head: {
        label: string;
        ref: string;
        sha: string;
        repo: GitHubRepo | null;
    };
    base: {
        label: string;
        ref: string;
        sha: string;
        repo: GitHubRepo;
    };
    user: {
        login: string;
        id: number;
    };
    created_at: string;
    updated_at: string;
}

export class GitHubService {
    private octokit: Octokit;

    constructor(accessToken: string) {
        this.octokit = new Octokit({ auth: accessToken });
    }

    // Repository Operations
    async forkRepository(owner: string, repo: string): Promise<GitHubRepo> {
        try {
            const response = await this.octokit.rest.repos.createFork({
                owner,
                repo,
            });
            return response.data as GitHubRepo;
        } catch (error) {
            console.error("Error forking repository:", error);
            throw new Error("Failed to fork repository");
        }
    }

    async getRepository(owner: string, repo: string): Promise<GitHubRepo> {
        try {
            const response = await this.octokit.rest.repos.get({
                owner,
                repo,
            });
            return response.data as GitHubRepo;
        } catch (error) {
            console.error("Error getting repository:", error);
            throw new Error("Failed to get repository");
        }
    }

    async getUserRepositories(): Promise<GitHubRepo[]> {
        try {
            const response = await this.octokit.rest.repos.listForAuthenticatedUser({
                type: "owner",
                sort: "updated",
                per_page: 100,
            });
            return response.data as GitHubRepo[];
        } catch (error) {
            console.error("Error getting user repositories:", error);
            throw new Error("Failed to get user repositories");
        }
    }

    // File Operations
    async getRepositoryContents(
        owner: string,
        repo: string,
        path: string = "",
        branch?: string
    ): Promise<GitHubFile[]> {
        try {
            const response = await this.octokit.rest.repos.getContent({
                owner,
                repo,
                path,
                ref: branch,
            });

            const data = response.data as any;
            if (Array.isArray(data)) {
                return data.map(item => ({
                    name: item.name,
                    path: item.path,
                    type: item.type,
                    size: item.size,
                    url: item.url,
                    html_url: item.html_url,
                    download_url: item.download_url,
                    git_url: item.git_url,
                    sha: item.sha,
                })) as GitHubFile[];
            } else {
                return [data as GitHubFile];
            }
        } catch (error) {
            console.error("Error getting repository contents:", error);
            throw new Error("Failed to get repository contents");
        }
    }

    async getFileContent(
        owner: string,
        repo: string,
        path: string,
        branch?: string
    ): Promise<GitHubFileContent> {
        try {
            const response = await this.octokit.rest.repos.getContent({
                owner,
                repo,
                path,
                ref: branch,
            });

            const data = response.data as any;
            if (data.type === "file") {
                return {
                    name: data.name,
                    path: data.path,
                    content: Buffer.from(data.content, "base64").toString("utf-8"),
                    sha: data.sha,
                    size: data.size,
                    type: data.type,
                };
            } else {
                throw new Error("Path is not a file");
            }
        } catch (error) {
            console.error("Error getting file content:", error);
            throw new Error("Failed to get file content");
        }
    }

    async updateFile(
        owner: string,
        repo: string,
        path: string,
        content: string,
        message: string,
        sha?: string,
        branch?: string
    ): Promise<{ sha: string; commit: { sha: string; url: string } }> {
        try {
            const response = await this.octokit.rest.repos.createOrUpdateFileContents({
                owner,
                repo,
                path,
                message,
                content: Buffer.from(content).toString("base64"),
                sha,
                branch,
            });
            return {
                sha: response.data.commit.sha || "",
                commit: {
                    sha: response.data.commit.sha || "",
                    url: response.data.commit.url || "",
                },
            };
        } catch (error) {
            console.error("Error updating file:", error);
            throw new Error("Failed to update file");
        }
    }

    async createFile(
        owner: string,
        repo: string,
        path: string,
        content: string,
        message: string,
        branch?: string
    ): Promise<{ sha: string; commit: { sha: string; url: string } }> {
        try {
            const response = await this.octokit.rest.repos.createOrUpdateFileContents({
                owner,
                repo,
                path,
                message,
                content: Buffer.from(content).toString("base64"),
                branch,
            });
            return {
                sha: response.data.commit.sha || "",
                commit: {
                    sha: response.data.commit.sha || "",
                    url: response.data.commit.url || "",
                },
            };
        } catch (error) {
            console.error("Error creating file:", error);
            throw new Error("Failed to create file");
        }
    }

    // Branch Operations
    async createBranch(
        owner: string,
        repo: string,
        branchName: string,
        fromBranch: string = "main"
    ): Promise<GitHubBranch> {
        try {
            // Get the SHA of the base branch
            const baseBranch = await this.octokit.rest.repos.getBranch({
                owner,
                repo,
                branch: fromBranch,
            });

            const baseSha = baseBranch.data.commit.sha;

            // Create the new branch
            const response = await this.octokit.rest.git.createRef({
                owner,
                repo,
                ref: `refs/heads/${branchName}`,
                sha: baseSha,
            });

            return {
                name: branchName,
                commit: {
                    sha: response.data.object.sha,
                    url: response.data.object.url,
                },
                protected: false,
            };
        } catch (error) {
            console.error("Error creating branch:", error);
            throw new Error("Failed to create branch");
        }
    }

    async getBranches(owner: string, repo: string): Promise<GitHubBranch[]> {
        try {
            const response = await this.octokit.rest.repos.listBranches({
                owner,
                repo,
                per_page: 100,
            });
            return response.data.map(branch => ({
                name: branch.name,
                commit: {
                    sha: branch.commit.sha,
                    url: branch.commit.url,
                },
                protected: branch.protected || false,
            }));
        } catch (error) {
            console.error("Error getting branches:", error);
            throw new Error("Failed to get branches");
        }
    }

    // Pull Request Operations
    async createPullRequest(
        owner: string,
        repo: string,
        title: string,
        body: string,
        head: string,
        base: string = "main"
    ): Promise<GitHubPullRequest> {
        try {
            const response = await this.octokit.rest.pulls.create({
                owner,
                repo,
                title,
                body,
                head,
                base,
            });
            return response.data as GitHubPullRequest;
        } catch (error) {
            console.error("Error creating pull request:", error);
            throw new Error("Failed to create pull request");
        }
    }

    async getPullRequests(
        owner: string,
        repo: string,
        state: "open" | "closed" | "all" = "open"
    ): Promise<GitHubPullRequest[]> {
        try {
            const response = await this.octokit.rest.pulls.list({
                owner,
                repo,
                state,
                per_page: 100,
            });
            return response.data as GitHubPullRequest[];
        } catch (error) {
            console.error("Error getting pull requests:", error);
            throw new Error("Failed to get pull requests");
        }
    }

    async getPullRequest(owner: string, repo: string, prNumber: number): Promise<GitHubPullRequest> {
        try {
            const response = await this.octokit.rest.pulls.get({
                owner,
                repo,
                pull_number: prNumber,
            });
            return response.data as GitHubPullRequest;
        } catch (error) {
            console.error("Error getting pull request:", error);
            throw new Error("Failed to get pull request");
        }
    }

    // Commit Operations
    async getCommits(
        owner: string,
        repo: string,
        branch?: string,
        perPage: number = 50
    ): Promise<any[]> {
        try {
            const response = await this.octokit.rest.repos.listCommits({
                owner,
                repo,
                sha: branch,
                per_page: perPage,
            });
            return response.data;
        } catch (error) {
            console.error("Error getting commits:", error);
            throw new Error("Failed to get commits");
        }
    }
}

export function createGitHubService(accessToken: string): GitHubService {
    return new GitHubService(accessToken);
}