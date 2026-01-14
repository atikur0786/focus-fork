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
- [ ] GitHub OAuth Authentication
- [ ] Core "Focus Loop" Interface (UI Skeleton)
- [ ] Basic Issue Fetching (Octokit)

### Week 2: Intelligence & Planning
- [ ] AI Agent: "Issue Scout" (Smart filtering)
- [ ] AI Agent: "Focus Coach" (Task breakdown)
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
- **Strict TypeScript:** No `any`.
- **Auth.js (v5):** Using GitHub provider for seamless developer login. Minimal data retention (session only).

## 🔐 Security & Auth
- **Provider:** GitHub OAuth
- **Data:** We only store the session cookie; no database persistence for users yet (MVP).
- **Environment:** Requires `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`.

## 📝 Change Log
- **2026-01-15:** Implemented GitHub Authentication (Phase 2). Added SignIn/SignOut components and updated Landing Page.
- **2026-01-14:** Initialized project, setup Next.js + Tailwind + shadcn/ui. Created folder structure. Defined Vision & Roadmap. Switched AI to Gemini.

---
*This README is the single source of truth. Do not overwrite without recording changes.*
