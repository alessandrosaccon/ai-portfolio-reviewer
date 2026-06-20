<div align="center">

<h1>AI Portfolio Reviewer</h1>

<p><strong>Know your fit before you apply.</strong></p>

<p>A production-grade SaaS web app that analyzes your CV against any job description — generating a credible fit score, keyword analysis, skill gap detection, and AI-powered rewrite suggestions.</p>

<p>
  <a href="https://ai-portfolio-reviewer-blush.vercel.app"><strong>Live Demo →</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/alessandrosaccon/ai-portfolio-reviewer">Source Code</a>
</p>

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_+_DB-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai&logoColor=white)](https://openai.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)
[![MIT License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## The problem it solves

Most job seekers apply blindly — no idea how well their CV matches the role, which keywords ATS systems filter out, or what specific gaps to address before submitting. AI Portfolio Reviewer solves this with a single upload: paste a job description, upload your PDF CV, and get back a structured, credible analysis in seconds — not vague AI-generated advice, but concrete scores, ranked skill gaps, and diff-style rewrite suggestions.

---

## Screenshots

<img width="1470" height="769" alt="Screenshot 2026-06-20 alle 12 12 53" src="https://github.com/user-attachments/assets/e1d9978d-4155-49ed-b43a-37bd6192738f" />

<img width="1466" height="767" alt="Screenshot 2026-06-20 alle 12 17 13" src="https://github.com/user-attachments/assets/8cedd924-fee5-4706-8b19-b38c6895ea1a" />

<img width="1467" height="767" alt="Screenshot 2026-06-20 alle 12 13 23" src="https://github.com/user-attachments/assets/4f8cf12c-224b-41aa-a55b-9870b33f7879" />


<img width="1467" height="763" alt="Screenshot 2026-06-20 alle 12 14 53" src="https://github.com/user-attachments/assets/6efdb03c-163b-4149-8cee-d81781f19a41" />

<img width="1465" height="762" alt="Screenshot 2026-06-20 alle 12 16 18" src="https://github.com/user-attachments/assets/43ef3ced-684a-44c5-8787-8307e3ba3e60" />

<img width="1465" height="762" alt="Screenshot 2026-06-20 alle 12 16 46" src="https://github.com/user-attachments/assets/e04de438-748f-4f00-be31-22441f4e3c77" />
---

## Features

- **Fit score** — 0–100 composite score across 4 weighted dimensions (Skills 35%, Keywords 25%, Experience 25%, Presentation 15%)
- **Keyword analysis** — matched vs missing ATS keywords visualized as pills; instantly shows what the recruiter's filter sees
- **Skill gap detection** — missing skills ranked by priority (required / preferred / nice-to-have)
- **AI rewrite suggestions** — section-level improvements with original vs suggested diff, powered by GPT-4o
- **Analysis history** — every analysis persisted to your account, fully browsable and re-readable
- **Authentication** — email/password signup with Supabase Auth; cookie-based sessions, no client-side token exposure
- **Dark mode** — full light/dark theme with system preference detection
- **Responsive UI** — mobile-first layout with a collapsible sidebar and bottom navigation on small screens

---

## Demo availability

> ⚠️ **Important note about the live demo**

The live demo runs on Supabase's **free tier**. Supabase automatically **pauses free-tier database instances** after a period of inactivity (typically 7 days with no connections).

If you visit the demo and encounter a loading error, a blank dashboard, or an authentication failure, this is most likely because the database instance has been paused — **not a bug in the application itself**.

**This is an intentional trade-off.** This project is a portfolio demonstration, not a commercial service. Running a paid Supabase instance continuously just to keep a demo alive 24/7 is not the goal. The codebase, architecture, and engineering decisions are the artifact — the live URL is a convenience.

To fully evaluate the project, clone the repository and run it locally (see [Getting Started](#getting-started) below). If the demo is paused, it typically resumes within 30–60 seconds of the first request hitting it.

---

## Tech stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 15.3 |
| Language | TypeScript (strict mode) | 5.4 |
| Styling | Tailwind CSS + shadcn/ui | 3.4 |
| Auth | Supabase Auth + `@supabase/ssr` | 0.6 |
| Database | Supabase (PostgreSQL + RLS) | — |
| AI | OpenAI GPT-4o (JSON mode) | 4.47 |
| PDF parsing | pdf-parse (Node.js, server-only) | 1.1 |
| Forms | React Hook Form + Zod | 7.51 + 3.23 |
| Animation | Framer Motion | 11.2 |
| Deployment | Vercel | — |

---

## Architecture

For a full technical deep-dive, see [`ARCHITECTURE.md`](ARCHITECTURE.md). Here is the high-level picture.

### Analysis pipeline

```
User uploads PDF + pastes job description
              │
              ▼
   POST /api/analyze
              │
   ┌──────────▼──────────┐
   │  1. Auth check       │  ← supabase.auth.getUser()
   │  2. Validate input   │  ← type: PDF, size ≤ 5 MB, JD required
   │  3. Extract PDF text │  ← pdf-parse (Node.js runtime)
   │  4. Truncate text    │  ← 8 000 chars max (GPT-4o context)
   │  5. INSERT analysis  │  ← status: "processing"
   │  6. Build prompt     │  ← server/prompts/analysis.ts
   │  7. Call GPT-4o      │  ← response_format: json_object
   │  8. Compute score    │  ← weighted average, server-side only
   │  9. UPDATE analysis  │  ← status: "completed", result: JSONB
   └──────────┬──────────┘
              │
              ▼
   Return { id } → client redirects to /analysis/:id
```

### Scoring model

| Dimension | Weight | Measures |
|---|---|---|
| Skills | 35% | Technical + soft skill overlap with requirements |
| Keywords | 25% | ATS-relevant keyword density |
| Experience | 25% | Seniority level and years of experience fit |
| Presentation | 15% | CV structure, clarity, and readability |

| Score range | Label |
|---|---|
| 75 – 100 | ✅ Strong match |
| 50 – 74 | 🟡 Partial match |
| 0 – 49 | 🔴 Weak match |

### Key design decisions

**Cookie-based auth with `@supabase/ssr`** — Sessions are stored in HTTP-only cookies and validated server-side on every request. Middleware uses `getSession()` for edge-safe JWT verification; Server Components and API routes always call `getUser()` for authoritative checks. No session state leaks to the browser.

**Structured AI output** — The OpenAI call uses `response_format: { type: "json_object" }` with a typed schema. This avoids brittle text parsing and makes the result predictable enough to store as typed JSONB and render as structured components.

**Server-side scoring** — Score logic is not trusted from the model. GPT-4o returns raw dimension scores; the server computes the weighted average independently. Weights are easy to tune without touching the prompt.

**Row Level Security everywhere** — All Supabase tables have RLS enabled. A user can only read and write their own rows. No client-side filtering substitutes for server-side authorization.

**Feature-first folder structure** — Domain logic lives in `features/` (auth, upload, analysis, dashboard) rather than a `components/` monolith. Shared primitives stay in `components/ui/`. Each feature is independently understandable and deletable.

---

## Project structure

```
ai-portfolio-reviewer/
├── app/
│   ├── (app)/                  # Authenticated shell (Sidebar + AppHeader)
│   │   ├── dashboard/          # Dashboard overview + new analysis form
│   │   ├── analysis/[id]/      # Full result page
│   │   ├── history/            # Analysis history list
│   │   └── settings/           # Account settings
│   ├── (auth)/                 # Minimal auth layout
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (marketing)/            # Public pages (pricing, privacy, terms)
│   ├── api/
│   │   └── analyze/            # Core AI analysis route (PDF → GPT-4o → DB)
│   └── auth/callback/          # OAuth / magic-link PKCE code exchange
├── components/
│   ├── shared/                 # Sidebar, AppHeader, Header, Footer, ThemeToggle
│   └── ui/                     # shadcn/ui primitives (Button, Input, Badge, Card…)
├── features/
│   ├── auth/                   # LoginForm, SignupForm, ForgotPasswordForm
│   ├── upload/                 # UploadZone, AnalysisForm
│   ├── dashboard/              # DashboardShell
│   ├── history/                # HistoryList
│   ├── analysis/               # ScoreCard, KeywordSection, SkillGapList, SuggestionsList
│   └── landing/                # HeroSection, FeaturesSection, HowItWorksSection
├── lib/
│   ├── supabase/               # client.ts · server.ts · middleware.ts
│   ├── openai.ts               # OpenAI singleton
│   ├── pdf-parser.ts           # PDF text extraction (server-only)
│   └── utils.ts                # cn(), formatDate(), getScoreLabel()
├── server/
│   ├── prompts/                # buildAnalysisPrompt() — GPT-4o structured prompt
│   └── scoring.ts              # computeOverallScore(), normalizeScore()
├── types/
│   ├── analysis.ts             # AnalysisResult, ScoreBreakdown, SkillGapItem
│   ├── db.ts                   # Supabase generated database types
│   └── user.ts                 # UserProfile
├── supabase/
│   └── migrations/             # SQL schema + RLS policies
├── middleware.ts                # Session refresh + route protection
└── vercel.json                 # Function timeout + security headers
```

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier is fine)
- An [OpenAI](https://platform.openai.com) API key with GPT-4o access

### 1. Clone and install

```bash
git clone https://github.com/alessandrosaccon/ai-portfolio-reviewer.git
cd ai-portfolio-reviewer
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Then fill in the values:

| Variable | Required | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase → Project Settings → API |
| `OPENAI_API_KEY` | ✅ | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `OPENAI_MODEL` | optional | Defaults to `gpt-4o`. Use `gpt-4o-mini` to reduce costs. |
| `NEXT_PUBLIC_APP_URL` | ✅ | `http://localhost:3000` for local dev |

> **Tip:** Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. It is never prefixed with `NEXT_PUBLIC_` and must never be exposed to the browser.

### 3. Set up the database

```bash
# Option A — Supabase CLI (recommended)
npx supabase db push

# Option B — manual
# Open supabase/migrations/0001_initial_schema.sql in the Supabase SQL editor and run it
```

The migration creates:
- `profiles` table with an auto-create trigger on new auth signups
- `analyses` table with a status enum, JSONB result column, and `updated_at` trigger
- Row Level Security policies restricting every row to its owner

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and run your first analysis.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run type-check` | TypeScript check (no emit) |

---

## Deployment

Deploy to Vercel in one click — no extra configuration needed beyond environment variables.

1. Import the repo on [vercel.com/new](https://vercel.com/new)
2. Add the five environment variables listed above
3. Deploy — `vercel.json` handles function timeouts and security headers automatically

The `vercel.json` configures:
- 60s max duration for the `/api/analyze` route (covers the GPT-4o call)
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` security headers

For a custom domain: Vercel → Project → Domains. SSL is provisioned automatically.

---

## Roadmap

**Completed**

- [x] Phase 1 — Project setup, stack, design system
- [x] Phase 2 — Landing page and marketing pages
- [x] Phase 3 — Supabase Auth, middleware, dashboard shell
- [x] Phase 4 — PDF upload, AI analysis engine, result page
- [x] Phase 5 — Mobile nav, SEO, security headers

**Planned**

- [ ] LinkedIn profile import (URL → scraped text)
- [ ] Portfolio URL analysis (personal site + GitHub)
- [ ] Export analysis result as PDF report
- [ ] Async analysis with email notification (Inngest or Supabase Edge Functions)
- [ ] Usage limits and billing (Stripe)
- [ ] Multi-language CV support

---

## Contributing

This is primarily a portfolio project, but issues and pull requests are welcome. If you spot a bug or have a concrete improvement in mind, open an issue first to discuss scope.

---

## Author

**Alessandro Saccon**

[alessandrosaccon.com](https://alessandrosaccon.com) · [GitHub @alessandrosaccon](https://github.com/alessandrosaccon)

---

## License

[MIT](LICENSE)
