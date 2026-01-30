
"use server"

import { auth } from "@/lib/auth"
import { scoutIssue, searchGitHubIssues } from "@/lib/github/scout"
import { createFocusPlan } from "@/lib/ai/coach"
import { createGitHubService, GitHubRepo, GitHubFile, GitHubPullRequest } from "@/lib/github/service"

export async function searchPublicIssuesAction(query: string) {
    if (!query) return []
    // Limit to 10 for public browser to be safe/fast
    return await searchGitHubIssues(query, 10)
}

export async function startSessionAction(formData: FormData) {
    const language = formData.get("language") as string || "typescript"
    const skillLevel = formData.get("skillLevel") as "beginner" | "intermediate" || "beginner"
    const issueUrl = formData.get("issueUrl") as string

    console.log(`[Action] Starting session. Url: ${issueUrl}, Lang: ${language}`)

    let issue = null

    // 1. Scout Issue (if no URL provided) or Fetch Issue (if URL provided)
    if (issueUrl) {
        // TODO: In a real app, we would verify this URL and fetch details via Octokit
        // For now, we will create a partial issue object from the URL or minimal fetch
        // Since we don't have a "getIssueByUrl" helper yet, we'll strip info from the URL
        // This is a simplification for the prototype.
        issue = {
            id: Date.now(),
            number: parseInt(issueUrl.split("/").pop() || "0"),
            title: "Selected from Dashboard", // We should fetch this ideally
            body: "User selected this issue directly.",
            html_url: issueUrl,
            repository_url: "...",
            labels: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            comments: 0
        }
    } else {
        const scoutResult = await scoutIssue({ language, skillLevel })
        if (!scoutResult) {
            return { error: "No suitable issues found. Try again later." }
        }
        issue = scoutResult.issue
    }

    if (!issue) {
        return { error: "Failed to resolve issue." }
    }

    // 2. Create Plan
    const plan = await createFocusPlan({
        title: issue.title,
        body: issue.body || "",
        url: issue.html_url
    })

    return {
        issue,
        plan
    }
}

// GitHub Repository Operations
export async function forkRepositoryAction(owner: string, repo: string) {
    const session = await auth()
    if (!session?.user?.id || !session.accessToken) {
        throw new Error("Authentication required")
    }

    const githubService = createGitHubService(session.accessToken)
    return await githubService.forkRepository(owner, repo)
}

export async function getRepositoryAction(owner: string, repo: string) {
    const session = await auth()
    if (!session?.user?.id || !session.accessToken) {
        throw new Error("Authentication required")
    }

    const githubService = createGitHubService(session.accessToken)
    return await githubService.getRepository(owner, repo)
}

export async function getUserRepositoriesAction() {
    const session = await auth()
    if (!session?.user?.id || !session.accessToken) {
        throw new Error("Authentication required")
    }

    const githubService = createGitHubService(session.accessToken)
    return await githubService.getUserRepositories()
}

// File Operations
export async function getRepositoryContentsAction(
    owner: string,
    repo: string,
    path: string = "",
    branch?: string
) {
    const session = await auth()
    if (!session?.user?.id || !session.accessToken) {
        throw new Error("Authentication required")
    }

    const githubService = createGitHubService(session.accessToken)
    return await githubService.getRepositoryContents(owner, repo, path, branch)
}

export async function getFileContentAction(
    owner: string,
    repo: string,
    path: string,
    branch?: string
) {
    const session = await auth()
    if (!session?.user?.id || !session.accessToken) {
        throw new Error("Authentication required")
    }

    const githubService = createGitHubService(session.accessToken)
    return await githubService.getFileContent(owner, repo, path, branch)
}

export async function updateFileAction(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha?: string,
    branch?: string
) {
    const session = await auth()
    if (!session?.user?.id || !session.accessToken) {
        throw new Error("Authentication required")
    }

    const githubService = createGitHubService(session.accessToken)
    return await githubService.updateFile(owner, repo, path, content, message, sha, branch)
}

export async function createFileAction(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch?: string
) {
    const session = await auth()
    if (!session?.user?.id || !session.accessToken) {
        throw new Error("Authentication required")
    }

    const githubService = createGitHubService(session.accessToken)
    return await githubService.createFile(owner, repo, path, content, message, branch)
}

// Branch Operations
export async function createBranchAction(
    owner: string,
    repo: string,
    branchName: string,
    fromBranch: string = "main"
) {
    const session = await auth()
    if (!session?.user?.id || !session.accessToken) {
        throw new Error("Authentication required")
    }

    const githubService = createGitHubService(session.accessToken)
    return await githubService.createBranch(owner, repo, branchName, fromBranch)
}

export async function getBranchesAction(owner: string, repo: string) {
    const session = await auth()
    if (!session?.user?.id || !session.accessToken) {
        throw new Error("Authentication required")
    }

    const githubService = createGitHubService(session.accessToken)
    return await githubService.getBranches(owner, repo)
}

// Pull Request Operations
export async function createPullRequestAction(
    owner: string,
    repo: string,
    title: string,
    body: string,
    head: string,
    base: string = "main"
) {
    const session = await auth()
    if (!session?.user?.id || !session.accessToken) {
        throw new Error("Authentication required")
    }

    const githubService = createGitHubService(session.accessToken)
    return await githubService.createPullRequest(owner, repo, title, body, head, base)
}

export async function getPullRequestsAction(
    owner: string,
    repo: string,
    state: "open" | "closed" | "all" = "open"
) {
    const session = await auth()
    if (!session?.user?.id || !session.accessToken) {
        throw new Error("Authentication required")
    }

    const githubService = createGitHubService(session.accessToken)
    return await githubService.getPullRequests(owner, repo, state)
}

// Utility function to extract repo info from URL
export async function extractRepoInfoFromUrl(url: string): Promise<{ owner: string; repo: string } | null> {
    try {
        const parsedUrl = new URL(url)
        const pathParts = parsedUrl.pathname.split('/').filter(Boolean)
        
        if (pathParts.length >= 2) {
            return {
                owner: pathParts[0],
                repo: pathParts[1]
            }
        }
        return null
    } catch (error) {
        return null
    }
}
