
"use server"

import { scoutIssue, searchGitHubIssues } from "@/lib/github/scout"
import { createFocusPlan } from "@/lib/ai/coach"

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
