# FocusFork: Open Source Focus Companion

> A productivity-focused web application that helps developers build consistent, focused work habits by removing decision fatigue and context switching when contributing to open source.

**Current Date:** 2026-01-14
**Status:** In Development (Phase 1)

## 🧠 Product Vision
Contributing to open source is hard not because of code, but because of **decision fatigue**: "What should I work on?", "Do I have time?", "Is this too hard?".

**DevFlow** solves this by acting as an intelligent Focus Coach:
1.  **Curates** high-quality, relevant issues instantly.
2.  **Plans** the session with AI-driven breakdowns.
3.  **Enforces** deep work with a dedicated focus interface.

This is **NOT** a toy. It is a tool for professional developers to reclaim their flow state.

## 🛠 Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Octokit (GitHub API)
- **Auth:** GitHub OAuth (via Auth.js)
- **AI:** Google Gemini (via Vercel AI SDK)
- **Observability:** Opik (Evaluation & Logging)
- **Deployment:** Vercel

## 🗺 4-Week Roadmap

### Week 1: Foundation & "The Loop" (Current)
- [x] Project scaffolding & Architecture
- [x] GitHub OAuth Authentication
- [x] Landing Page (High Fidelity - Ogaki Inspired) & Public Issue Browser
- [ ] Core "Focus Loop" Interface (UI Skeleton)
- [x] Basic Issue Fetching (Octokit)

### Week 2: Intelligence & Planning
- [x] AI Agent: "Issue Scout" (Smart filtering)
- [x] AI Agent: "Focus Coach" (Task breakdown)
- [ ] Session Planning UI

### Week 3: Deep Work & Habits
- [ ] Active Focus Timer with blockers/distraction logging
- [ ] Post-session reflection & metrics
- [ ] Streak & consistency tracking

### Week 4: Polish & Launch
- [ ] Opik Integration for AI/Agent Eval
- [ ] Premium UI Polish (Animations, Dark Mode)
- [ ] Final Deployment & Documentation

## 🏗 Architecture Decisions
- **Next.js App Router:** For server components and simplified data fetching.
- **Server Actions:** For mutations to keep the client thin.
- **Tailwind v4:** For modern, performant styling.
- **Global Theming:** `next-themes` provider wrapping the root layout. parity between Light/Dark modes using `hsl` variables.
- **Agile Redesign:** Pivot to "Ogaki Digital" aesthetic (Bold, Structured, High Contrast) midway through Phase 1 to align with "Professional Tool" vision.

## 🤖 Issue Scout Logic (Phase 3)
The **Issue Scout** selects the best task using a weighted scoring algorithm:

1.  **Fetch:** Queries GitHub API for `is:open no:assignee language:{target}`.
2.  **Filter:** Uses labels (`good first issue`, `help wanted`) based on skill level.
3.  **Score:**
    -   **+10** Detailed Description (>500 chars)
    -   **+5** Recent Activity (<3 days)
    -   **+5** Community Engagement (>0 comments)
    -   **+5** explicitly labelled `good first issue`
    -   **-10** Stub/Short Description (<100 chars)
4.  **Select:** Returns the single highest-scoring issue.

## 🧠 Focus Coach Agent (Phase 4)
The **Focus Coach** uses **Google Gemini** to prepare the developer for deep work.

-   **Input:** GitHub Issue (Title, Body)
-   **Prompt Strategy:** "Engineering Manager" persona. Strict "No Code Generation" rule.
-   **Output:** Structured JSON (Summary, Success Criteria, Step-by-Step Plan).
-   **Observability:** All reasoning traces logged to **Opik** for quality evaluation.
-   **Mock Fallback:** If the Gemini API hits quotas (429) or is unavailable (404), the system gracefully falls back to a "Mock Plan" to ensure the UI flow remains testable.

## 🎨 Design System (Ogaki Pivot)
-   **Aesthetic:** "High Contrast Professional" (Bold Typography, Structured Grid, Solid Backgrounds).
-   **Principles:**
    -   **Structure over Blur:** Replaced extensive glassmorphism with solid `bg-card` and distinct `border-border`.
    -   **Bold Typography:** Lighter font weights for headings but larger scale.
    -   **Theming:** 100% feature parity between Light (Clean White/Black) and Dark (Deep Charcoal/White).

## 🚀 Landing Page UX (Phase 1 Refinement)
-   **Goal:** Convert visitors to users without ensuring "AI Wrapper" vibes.
-   **Structure:**
    1.  **Hero:** Value proposition first. "Browse Issues" (No Auth) vs "Dashboard" (Auth).
    2.  **Public Issue Browser:** Allows unauthenticated users to experience the "Scout" value prop immediately by searching real live GitHub issues.
    3.  **Workflow Timeline:** Visualizes the 4-step process (Scout -> Focus -> Fork -> Contribute).
    4.  **Why FocusFork:** Addresses psychological barriers (Design Fatigue, Imposter Syndrome).
-   **Tech:** `PublicIssueBrowser` is a Client Component using Server Actions to fetch data via Octokit (unauthenticated/shared token).

## 🔐 Security & Auth
- **Provider:** GitHub OAuth
- **Data:** We only store the session cookie; no database persistence for users yet (MVP).
- **Environment:** Requires `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`.

## 📝 Change Log
- **2026-01-17 [Redesign]:** Full UI Pivot to "Ogaki Digital" aesthetic. Implemented Global Light/Dark Theming (`next-themes`) and fixed Auth SignOut flow. Updated Header/Footer components.
- **2026-01-17:** Enhanced Landing Page with "Public Issue Browser" (Client Component + Server Action) and high-fidelity sections ("Why FocusFork", "Workflow"). Implemented Mock Fallback for AI Coach.
- **2026-01-16:** Implemented **Focus Coach Agent** (Phase 4). Integrated Gemini 1.5 Pro and Opik for tracing. Implemented **Issue Scout** logic (Phase 3).
- **2026-01-15:** Implemented GitHub Authentication (Phase 2). Added SignIn/SignOut components and updated Landing Page.
- **2026-01-14:** Initialized project, setup Next.js + Tailwind + shadcn/ui. Created folder structure. Defined Vision & Roadmap. Switched AI to Gemini.

---
*This README is the single source of truth. Do not overwrite without recording changes.*
