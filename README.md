# AI Portfolio Reviewer

> Analyze your CV against any job description. Get AI-powered fit scores, skill gap insights, and concrete rewrite suggestions.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-2.43-3ecf8e?logo=supabase)](https://supabase.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)](https://openai.com)

---

## What it does

- Upload a CV in PDF format
- Paste a job description or target role
- Get an instant **fit score** (0–100) across 4 dimensions
- See **missing keywords** and **skill gaps** highlighted
- Read **concrete rewrite suggestions** for every CV section
- Browse your **analysis history**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | OpenAI GPT-4o |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

---

## Project Structure

```
ai-portfolio-reviewer/
├── app/                  # Next.js App Router
│   ├── (marketing)/      # Public pages: landing, pricing
│   ├── (app)/            # Authenticated app: dashboard, analysis, history
│   ├── api/              # API route handlers
│   └── globals.css
├── components/
│   ├── ui/               # shadcn/ui primitives
│   └── shared/           # Header, Footer, ThemeProvider
├── features/             # Domain-driven feature modules
│   ├── upload/
│   ├── analysis/
│   ├── history/
│   └── auth/
├── lib/                  # Singleton clients and utilities
├── server/               # Server-only logic (prompts, scoring)
├── types/                # Global TypeScript types
└── public/
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

Fill in your keys:
- **Supabase**: create a project at [supabase.com](https://supabase.com), copy URL and anon key
- **OpenAI**: get an API key from [platform.openai.com](https://platform.openai.com/api-keys)

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Roadmap

- [x] Phase 1: Project setup, stack configuration, design tokens
- [ ] Phase 2: Landing page & design system
- [ ] Phase 3: Auth (Supabase) & dashboard shell
- [ ] Phase 4: CV upload + AI analysis engine
- [ ] Phase 5: History, polish & Vercel deploy

---

## License

MIT
