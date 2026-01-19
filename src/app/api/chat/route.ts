
import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";
import { searchGitHubIssues } from "@/lib/github/scout"; // Direct library call is better than action here

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: google("gemini-1.5-flash"),
        system: `You are the FocusFork Scout, an expert engineering manager helping developers find open source issues.
    
    Your goal is to understand the user's skill level and interests, and then recommend specific GitHub issues.
    
    1.  Ask clarifying questions if the user is vague (e.g., "What language?", "Frontend or Backend?").
    2.  Use the 'searchIssues' tool to find real issues when you have enough info.
    3.  Present the issues clearly.
    4.  Explain WHY you picked them (referencing the heuristic score or specific traits).
    5.  Encourage them to select an issue to start a workspace.
    
    Be concise, professional, and encouraging.`,
        messages,
        tools: {
            searchIssues: tool({
                description: "Search for open GitHub issues using a query",
                parameters: z.object({
                    query: z.string().describe("The search query (e.g., 'language:typescript label:bug is:open')"),
                }),
                execute: async ({ query }) => {
                    // Limit to 5 for chat context
                    const issues = await searchGitHubIssues(query, 5);
                    return issues.map(i => ({
                        id: i.id,
                        number: i.number,
                        title: i.title,
                        html_url: i.html_url,
                        repo: i.repository_url.split("/").slice(-2).join("/"),
                        labels: i.labels.map(l => typeof l === 'string' ? l : l.name)
                    }));
                },
            }),
        },
    });

    return result.toDataStreamResponse();
}
