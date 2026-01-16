import { Octokit } from "octokit";

// Initialize Octokit (can use a personal token or unauthenticated for public repos, 
// but auth is recommended for higher rate limits. Ideally use the user's session token if possible, 
// or a shared app token from env).
const octokit = new Octokit({
    auth: process.env.AUTH_GITHUB_TOKEN || process.env.GITHUB_TOKEN, // Fallback
});

export interface IssueScoutOptions {
    language: string;
    skillLevel?: "beginner" | "intermediate" | "expert";
}

export interface ScoredIssue {
    issue: any;
    score: number;
    reason: string[];
}

export async function scoutIssue(options: IssueScoutOptions) {
    const { language, skillLevel } = options;

    // 1. Construct Query
    // is:issue is:open no:assignee language:${lang} sort:updated-desc
    let query = `is:issue is:open no:assignee language:${language} sort:updated-desc`;

    if (skillLevel === "beginner") {
        query += ` label:"good first issue"`;
    } else if (skillLevel === "intermediate") {
        query += ` label:"help wanted"`;
    }
    // Expert might rely on recent complex issues or just standard help wanted without the "good first issue" filter.

    try {
        // 2. Fetch Candidates
        const response = await octokit.rest.search.issuesAndPullRequests({
            q: query,
            per_page: 20, // Fetch top 20 candidates to score
            sort: "updated",
            order: "desc",
        });

        const candidates = response.data.items;

        if (candidates.length === 0) {
            return null;
        }

        // 3. Score Candidates
        const scoredCandidates: ScoredIssue[] = candidates.map((issue) => {
            let score = 0;
            const reasons: string[] = [];

            // Heuristic A: Description Length (Quality proxy)
            const bodyLength = issue.body ? issue.body.length : 0;
            if (bodyLength > 500) {
                score += 10;
                reasons.push("Detailed description (+10)");
            } else if (bodyLength < 100) {
                score -= 10;
                reasons.push("Short description (-10)");
            }

            // Heuristic B: Activity
            const updatedDate = new Date(issue.updated_at);
            const now = new Date();
            const daysSinceUpdate = (now.getTime() - updatedDate.getTime()) / (1000 * 3600 * 24);

            if (daysSinceUpdate < 3) {
                score += 5;
                reasons.push("Recently active (+5)");
            }

            // Heuristic C: Engagement
            if (issue.comments > 0) {
                score += 5;
                reasons.push("Has discussion (+5)");
            }

            // Heuristic D: Labels
            const labels = issue.labels.map((l: any) => (typeof l === 'string' ? l : l.name?.toLowerCase()));
            if (labels.includes("good first issue")) {
                score += 5;
                reasons.push("Beginner friendly (+5)");
            }
            if (labels.includes("bug")) {
                score += 3;
                reasons.push("Is a bug fix (+3)");
            }

            return { issue, score, reason: reasons };
        });

        // 4. Select Winner
        // Sort by score descending
        scoredCandidates.sort((a, b) => b.score - a.score);

        // Return the top issue
        return scoredCandidates[0];

    } catch (error) {
        console.error("Issue Scout Error:", error);
        throw new Error("Failed to scout issues.");
    }
}
