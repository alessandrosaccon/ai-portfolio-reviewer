# AI Portfolio Reviewer

> Know your fit before you apply.

A modern SaaS web app that analyzes your CV against any job description — generating a credible fit score, keyword analysis, skill gap detection, and AI-powered rewrite suggestions.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_+_DB-3ecf8e?logo=supabase)](https://supabase.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)](https://openai.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## Features

- **CV upload** — drag & drop or browse, PDF only, validated client and server-side
- **Fit score** — overall 0–100 score with 4 weighted dimensions (skills, keywords, experience, presentation)
- **Keyword analysis** — matched vs missing ATS keywords highlighted as pills
- **Skill gap** — sorted by importance (required / preferred / nice-to-have) with suggestions per skill
- **Rewrite suggestions** — section-level improvements with original vs suggested side-by-side
- **Analysis history** — every past analysis saved to your account
- **Auth** — email/password sign up and sign in via Supabase Auth
- **Dark mode** — full system-aware dark mode with manual toggle
- **Responsive** — sidebar on desktop, drawer on mobile
- **Accessible** — keyboard navigation, `aria-*` labels, focus management throughout

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | RSC, Server Actions, file-based routing |
| Language | TypeScript 5 (strict) | End-to-end type safety |
| Styling | Tailwind CSS + shadcn/ui | Design tokens, dark mode, custom components |
| Auth | Supabase Auth + `@supabase/ssr` | Cookie-based sessions, SSR-safe |
| Database | Supabase (PostgreSQL) | Row Level Security on all tables |
| AI | OpenAI GPT-4o | JSON-mode structured output |
| PDF parsing | pdf-parse | Node.js runtime, server-only |
| Forms | React Hook Form + Zod | Schema-driven validation, no re-renders |
| Deployment | Vercel | Zero-config, 60s function timeout for AI route |

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
│   │   └── signup/
│   ├── (marketing)/            # Public pages (privacy, terms)
│   ├── api/
│   │   └── analyze/            # Core AI analysis API route
│   └── auth/callback/          # OAuth code exchange handler
├── components/
│   ├── shared/                 # Sidebar, AppHeader, MobileNav, ThemeToggle
│   └── ui/                     # shadcn/ui primitives
├── features/
│   ├── auth/                   # LoginForm, SignupForm, UserMenu, Server Actions
│   ├── upload/                 # UploadZone, AnalysisForm
│   ├── dashboard/              # DashboardShell, DashboardSkeleton
│   ├── history/                # HistoryList
│   └── analysis/               # ScoreCard, SkillGapList, SuggestionsList, ...
├── lib/
│   ├── supabase/               # client.ts, server.ts, middleware.ts
│   ├── openai.ts               # OpenAI client singleton
│   ├── pdf-parser.ts           # PDF text extraction utility
│   └── utils.ts                # cn(), formatDate()
├── server/
│   ├── prompts/                # buildAnalysisPrompt() — structured GPT-4o prompt
│   └── scoring.ts              # computeOverallScore(), getScoreLabel()
├── types/
│   ├── analysis.ts             # AnalysisResult, ScoreBreakdown, SkillGapItem
│   ├── db.ts                   # Supabase database types
│   └── user.ts                 # UserProfile
├── supabase/
│   └── migrations/             # SQL schema + RLS policies
├── middleware.ts                # Session refresh + route protection
└── vercel.json                  # Deployment config + security headers
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/alessandrosaccon/ai-portfolio-reviewer.git
cd ai-portfolio-reviewer
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API |
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally |

### 3. Set up the database

Run the migration in your Supabase SQL editor:

```bash
# Option A — Supabase CLI
supabase db push

# Option B — manual
# Open supabase/migrations/0001_initial_schema.sql in the Supabase SQL editor and run it
```

The migration creates:
- `profiles` table with auto-create trigger on signup
- `analyses` table with status enum, indexes, `updated_at` trigger
- Row Level Security policies on both tables

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up.

---

## Analysis Pipeline

```
User: upload PDF + paste job description
              │
              ▼
   POST /api/analyze
              │
   ┌──────────▼──────────┐
   │  1. Auth check       │  ← Supabase getUser()
   │  2. Validate file    │  ← type: PDF, size ≤ 5MB
   │  3. Extract PDF text │  ← pdf-parse (Node.js)
   │  4. Truncate text    │  ← 8000 chars max
   │  5. INSERT analysis  │  ← status: processing
   │  6. Build prompt     │  ← server/prompts/analysis.ts
   │  7. Call GPT-4o      │  ← response_format: json_object
   │  8. Compute score    │  ← weighted average, server-side
   │  9. UPDATE analysis  │  ← status: completed, result: JSONB
   └──────────┬──────────┘
              │
              ▼
   Return { id } → redirect to /analysis/:id
```

---

## Scoring Model

| Dimension | Weight | Measures |
|---|---|---|
| Skills | 35% | Technical + soft skill overlap |
| Keywords | 25% | ATS keyword density |
| Experience | 25% | Seniority and years of experience fit |
| Presentation | 15% | CV structure and clarity |

**Score labels:** 80–100 = Strong match · 50–79 = Partial match · 0–49 = Weak match

---

## Deployment

The project is ready to deploy on Vercel with zero additional configuration.

1. Import the repository on [vercel.com](https://vercel.com)
2. Add all environment variables from `.env.local.example`
3. Deploy — the `vercel.json` handles function timeout and security headers automatically

---

## Roadmap

- [x] Phase 1 — Project setup, stack, design tokens
- [x] Phase 2 — Landing page and design system
- [x] Phase 3 — Supabase Auth, middleware, dashboard shell
- [x] Phase 4 — PDF upload, AI analysis engine, result page
- [x] Phase 5 — Mobile nav, SEO, security headers, ARCHITECTURE docs
- [ ] LinkedIn profile import
- [ ] Portfolio URL analysis
- [ ] Export result as PDF
- [ ] Async analysis with email notification

---

## License

MIT
