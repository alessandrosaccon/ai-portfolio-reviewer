# Architecture — AI Portfolio Reviewer

This document describes the technical architecture, key decisions, and data flow of the application.

---

## Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | RSC, file-based routing, Server Actions |
| Language | TypeScript (strict) | Type safety end-to-end |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, consistent design tokens |
| Auth + DB | Supabase | Managed Postgres, built-in RLS, Auth |
| AI | OpenAI GPT-4o | JSON-mode structured output, best reasoning |
| PDF parsing | pdf-parse | Lightweight Node.js PDF text extractor |
| Forms | React Hook Form + Zod | Performant, schema-driven validation |
| Deployment | Vercel | Zero-config Next.js, edge network |

---

## Project structure

```
.
├── app/
│   ├── (app)/              # Authenticated shell (Sidebar + AppHeader)
│   │   ├── dashboard/      # Dashboard + new analysis form
│   │   ├── analysis/[id]/  # Result page
│   │   ├── history/        # Full analysis history
│   │   └── settings/       # Account settings
│   ├── (auth)/             # Minimal auth layout
│   │   ├── login/
│   │   └── signup/
│   ├── (marketing)/        # Public pages (privacy, terms)
│   ├── api/
│   │   └── analyze/        # Core analysis API route
│   └── auth/callback/      # OAuth code exchange
├── components/
│   ├── shared/             # Layout components (Sidebar, AppHeader, MobileNav)
│   └── ui/                 # shadcn/ui primitives
├── features/
│   ├── auth/               # LoginForm, SignupForm, UserMenu, actions
│   ├── upload/             # UploadZone, AnalysisForm
│   ├── dashboard/          # DashboardShell, DashboardSkeleton
│   ├── history/            # HistoryList
│   └── analysis/           # ScoreCard, SkillGapList, SuggestionsList, ...
├── lib/
│   ├── supabase/           # client.ts, server.ts, middleware.ts
│   ├── openai.ts           # OpenAI client singleton
│   ├── pdf-parser.ts       # PDF text extraction
│   └── utils.ts            # cn(), formatDate(), etc.
├── server/
│   ├── prompts/            # analysis.ts — structured OpenAI prompt builder
│   └── scoring.ts          # computeOverallScore(), getScoreLabel()
├── types/
│   ├── analysis.ts         # AnalysisResult, ScoreBreakdown, SkillGapItem, ...
│   ├── db.ts               # Supabase database types (generated)
│   └── user.ts             # UserProfile
├── supabase/
│   └── migrations/         # SQL schema migrations
└── middleware.ts            # Session refresh + route protection
```

---

## Analysis pipeline

```
User uploads PDF + pastes job description
         │
         ▼
[POST /api/analyze]
         │
    1. Auth check (Supabase getUser)
         │
    2. Validate file (type: PDF, size ≤ 5MB)
         │
    3. extractTextFromPDF(buffer)  ← pdf-parse
         │
    4. truncateCVText(text, 8000)  ← token budget
         │
    5. INSERT analyses { status: 'processing' }
         │
    6. buildAnalysisPrompt({ cvText, jobDescription, jobTitle, company })
         │
    7. openai.chat.completions.create({ response_format: json_object })
         │
    8. computeOverallScore(dimensions)  ← weighted average, server-side
         │
    9. UPDATE analyses { status: 'completed', result: finalResult }
         │
         ▼
   return { id, result }  →  router.push('/analysis/:id')
```

---

## Scoring model

The overall score is a **weighted average** of 4 dimensions:

| Dimension | Weight | What it measures |
|---|---|---|
| Skills | 35% | Technical + soft skill overlap |
| Keywords | 25% | ATS keyword density |
| Experience | 25% | Seniority and years fit |
| Presentation | 15% | CV structure and clarity |

Score labels:
- **80–100** → Strong match (green)
- **50–79** → Partial match (amber)
- **0–49** → Weak match (red)

---

## Security model

- **Row Level Security** on all Supabase tables — users can only access their own data
- **Middleware** refreshes the session JWT on every request and enforces route protection
- **Server-only** Supabase client for all database writes — never exposes service role to the browser
- **Vercel security headers** — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`
- PDF parsing runs on Node.js runtime, never on the edge

---

## Rendering strategy

| Route | Strategy | Reason |
|---|---|---|
| `/` | SSG | Public, no user data |
| `/dashboard` | Dynamic RSC | Requires fresh Supabase query |
| `/analysis/[id]` | Dynamic RSC | Per-user data, not cacheable |
| `/history` | Dynamic RSC | User-specific list |
| `/settings` | Dynamic RSC | Live user metadata |
| `/login`, `/signup` | Static shell + Client form | Form interactivity |

---

## Key design decisions

**Why synchronous analysis (not background jobs)?**
For a portfolio project, a synchronous pipeline (request → parse → OpenAI → save → redirect) is simpler to reason about and demo. The 60s Vercel function timeout covers the worst case. At scale, this would move to a queue (e.g. Inngest or Supabase Edge Functions) with polling/webhooks.

**Why not stream the OpenAI response?**
Streaming works well for chat UIs. Here we need a complete, structured JSON object before we can render the score UI meaningfully — streaming would show a partial state that isn't useful.

**Why `@supabase/ssr` over the old `@supabase/auth-helpers-nextjs`?**
The `@supabase/ssr` package is the official replacement, aligned with Next.js App Router cookie semantics and Server Components.

**Why feature-based folder structure?**
`features/` groups related components, hooks and logic by domain (auth, upload, analysis) rather than by type (components, hooks). This makes it easier to reason about, refactor and delete features in isolation.
