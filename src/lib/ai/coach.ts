import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { opik } from "@/lib/opik";

// Define the schema for the focus plan
const FocusPlanSchema = z.object({
    summary: z.string().describe("A concise 2-sentence summary of the issue."),
    success_criteria: z.array(z.string()).describe("3-5 clear bullet points defining what 'done' looks like."),
    step_by_step_plan: z.array(z.string()).describe("A logical, step-by-step plan to tackle the issue. NON-TECHNICAL. Focus on process."),
    estimated_time_minutes: z.number().describe("Estimated time in minutes (30-120)."),
});

export type FocusPlan = z.infer<typeof FocusPlanSchema>;

const MOCK_PLAN: FocusPlan = {
    summary: "⚠️ MOCK PLAN: API Quota Exceeded. This is a generated fallback to allow UI testing.",
    success_criteria: [
        "Verify the application handles API errors gracefully",
        "Complete the focus session UI flow",
        "Check if the timer works correctly"
    ],
    step_by_step_plan: [
        "Analyze the issue description (Mock Step)",
        "Set up the local environment",
        "Reproduce the reported bug",
        "Implement the fix",
        "Run tests and verify"
    ],
    estimated_time_minutes: 45
};

export async function createFocusPlan(issue: { title: string; body: string; url: string }) {
    // Trace this function with Opik
    const trace = opik.trace({
        name: "Focus Coach Planning",
        input: issue,
    });

    try {
        const prompt = `
      You are an expert Engineering Focus Coach. Your goal is to help a developer enter a flow state to solve a GitHub issue.
      
      ISSUE TITLE: ${issue.title}
      ISSUE CONTEXT: ${issue.body}

      INSTRUCTIONS:
      1. Analyze the issue.
      2. Break it down into a clear, actionable plan.
      3. Do NOT generate code.
      4. Do NOT use complex technical jargon if possible. Keep it grounded.
      5. Focus on the "What" and "Why", and high-level "How".

      OUTPUT FORMAT:
      JSON compliant with the schema.
    `;

        // Attempt to call the API
        // Try gemini-1.5-pro first (most stable reference usually)
        try {
            const { object: plan } = await generateObject({
                model: google("gemini-1.5-pro"),
                schema: FocusPlanSchema,
                prompt: prompt,
                temperature: 0.2,
            });

            // Log the output to Opik
            trace.end();
            return plan;

        } catch (apiError) {
            console.warn("⚠️ Google Gemini API Failed (likely 429 Quota or 404). Switching to MOCK FALLBACK.", apiError);
            // Fallthrough to return mock plan
        }

        // If we reach here, API failed. Return mock.
        trace.end();
        return MOCK_PLAN;

    } catch (error) {
        trace.end();
        console.error("Focus Coach Critical Error:", error);
        // Even in catastrophic failure, return mock to keep app usable
        return MOCK_PLAN;
    }
}
