
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

    console.log(`[Action] Starting session for ${language} (${skillLevel})`)

    // 1. Scout Issue
    const scoutResult = await scoutIssue({ language, skillLevel })

    if (!scoutResult) {
        return { error: "No suitable issues found. Try again later." }
    }

    // 2. Create Plan
    const { issue } = scoutResult
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
