# AI Portfolio Reviewer

> Know your fit before you apply.

A production-grade SaaS web app that analyzes your CV against any job description — generating a credible fit score, keyword analysis, skill gap detection, and AI-powered rewrite suggestions. Built as a portfolio project to demonstrate end-to-end product engineering across frontend, backend, auth, and AI integration.

**[Live demo →](https://ai-portfolio-reviewer-blush.vercel.app)** &nbsp;·&nbsp; **[Source code](https://github.com/alessandrosaccon/ai-portfolio-reviewer)**

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_+_DB-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai&logoColor=white)](https://openai.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)

---

## What it does

Upload a PDF CV, paste a job description — get back a structured analysis in seconds:

- **Fit score** — 0–100 composite score across 4 weighted dimensions
- **Keyword analysis** — matched vs missing ATS keywords shown as pills
- **Skill gap** — missing skills ranked by importance (required / preferred / nice-to-have)
- **Rewrite suggestions** — section-level improvements with original vs suggested diff
- **Analysis history** — every past analysis persisted to your account

---

## Screenshots

> _Add screenshots here after first deployment — dashboard, analysis result page, mobile view._

---

## Technical decisions worth noting

This project goes beyond a standard tutorial stack. A few deliberate choices:

**Cookie-based auth with `@supabase/ssr`**
Rather than client-only auth (which causes layout flickers and exposes session state to JS), sessions are stored in HTTP-only cookies and validated server-side on every request. The middleware uses `getSession()` for edge-safe local JWT verification, while Server Components and API Routes always call `getUser()` for authoritative checks.

**Structured AI output**
The OpenAI call uses `response_format: { type: "json_object" }` with a typed schema. This avoids brittle text parsing and makes the result predictable enough to store as typed JSONB and render as structured components — not a raw text blob.

**Server-side scoring**
The fit score is computed server-side from the GPT-4o output using a weighted average (`skills 35% · keywords 25% · experience 25% · presentation 15%`). Score logic is not trusted from the model — the model returns raw dimension scores, and the server computes the overall. This makes it easy to adjust weights without re-prompting.

**Row Level Security everywhere**
All Supabase tables have RLS enabled and explicit policies. A user can only read and write their own rows. No client-side filtering substitutes for server-side authorization.

**Feature-first folder structure**
Instead of a generic `components/` monolith, domain logic lives in `features/` (`auth/`, `upload/`, `analysis/`, `dashboard/`). Shared primitives live in `components/ui/`. This makes the codebase navigable without knowing the full tree.

---

## Tech Stack

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

## Project Structure

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

## Analysis Pipeline

```
User uploads PDF + job description
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

---

## Scoring Model

| Dimension | Weight | Measures |
|---|---|---|
| Skills | 35% | Technical + soft skill overlap with requirements |
| Keywords | 25% | ATS-relevant keyword density |
| Experience | 25% | Seniority level and years of experience fit |
| Presentation | 15% | CV structure, clarity, and readability |

| Score range | Label |
|---|---|
| 75 – 100 | Strong match |
| 50 – 74 | Partial match |
| 0 – 49 | Weak match |

---

## Getting Started

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

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` in development |

### 3. Set up the database

```bash
# Option A — Supabase CLI
supabase db push

# Option B — manual
# Run supabase/migrations/0001_initial_schema.sql in the Supabase SQL editor
```

The migration creates:
- `profiles` table with auto-create trigger on auth signup
- `analyses` table with status enum, JSONB result column, and `updated_at` trigger
- Row Level Security policies restricting all access to the row owner

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account.

---

## Deployment

Deploy to Vercel in one click — no extra configuration needed.

1. Import the repo on [vercel.com/new](https://vercel.com/new)
2. Add the five environment variables
3. Deploy — `vercel.json` handles function timeout and security headers automatically

For a custom domain: add it in Vercel → Project → Domains. SSL is provisioned automatically.

---

## Roadmap

- [x] Phase 1 — Project setup, stack, design system
- [x] Phase 2 — Landing page and marketing pages
- [x] Phase 3 — Supabase Auth, middleware, dashboard shell
- [x] Phase 4 — PDF upload, AI analysis engine, result page
- [x] Phase 5 — Mobile nav, SEO, security headers
- [ ] LinkedIn profile import
- [ ] Portfolio URL analysis
- [ ] Export result as PDF
- [ ] Async analysis with email notification
- [ ] Usage limits and billing (Stripe)

---

## Author

**Alessandro Saccon** — [alessandrosaccon.com](https://alessandrosaccon.com) · [GitHub](https://github.com/alessandrosaccon)

---

## License

MIT
