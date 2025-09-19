# **Cursor Rules** — OptimaliQ Project

> **Purpose:** Auto-applied heuristics for code generation and review across the OptimaliQ repository. This document governs all development decisions and implementation patterns.

## 1.1 General Coding Rules

* **TypeScript:** `"strict": true`. Avoid `any`; prefer generics, `unknown` + schema parsing (Zod). Never ignore TS errors.
* **Contracts:** All API route IO must use Zod schemas (request/response). Export `schema.ts` near the route.
* **Errors:** Bubble user-safe messages; log server errors to Sentry. Never leak secrets.
* **Env:** All env reads via a single `lib/env.ts` validated by Zod; never use `process.env.X` inline in components.
* **Accessibility:** All interactive elements keyboard-navigable; `aria-*` labels; maintain contrast.
* **UX:** Use shadcn/ui and Tailwind; avoid style duplication; dark mode respected.
* **Testing:** Create unit tests for business logic (Vitest/Jest). Minimum: changed files must have tests or rationale noted.

## 1.2 Next.js / Vercel

* Use **Server Actions** judiciously; long jobs → background job (Vercel Cron + webhook) with progress via Supabase realtime.
* Use **Vercel AI SDK** for streaming LLM output; never block UI waiting for long jobs without a skeleton/progress.

## 1.3 Supabase / Postgres

* **Every schema change** via migration in `supabase/migrations` with forward/backward safety.
* **RLS first:** Deny-by-default; per-tenant `u_id/org_id` policies.
* Add `pgvector`; create HNSW/IVFFlat index for `market_articles.embedding`.

## 1.4 Stripe

* Use Checkout + Billing Portal. Webhooks verified; idempotency keys on server. Never expose secret keys client-side.

## 1.5 Agentic AI / RAG

* **Model Router:** multi-provider selection by latency/cost/health; retry with backoff.
* **Memory:** Short-term (session), medium (TTL snapshots), long (profiles). Persist summaries aligned to UI.
* **RAG:** Clean → embed → store → search → cite. Always include source URLs in trend cards.
* **Determinism:** Keep deterministic score maps for assessments; LLMs draft narratives only.

## 1.6 Charts & Analytics

* Use **Recharts** for Radar/Line/Bar; helpers in `lib/analytics/`. No blocking data fetches on client; prefer server components.

## 1.7 Docs & Process

* **Tech Doc** updated each milestone: Architecture, Schemas, APIs, Agents, Benchmarks, ADRs, Error Log.
* **To-Do Doc** updated per task with timestamp + note.
* **Frontend Architecture** reference `FRONTEND_UX_ARCHITECTURE.md` for all UI/UX decisions.

## 1.8 Frontend & UI/UX Standards

* **Design System First**: Use design tokens, never hardcode styles. Reference `FRONTEND_UX_ARCHITECTURE.md`.
* **Component Architecture**: Follow Atomic Design (Atoms → Molecules → Organisms → Templates → Pages).
* **Performance**: Target Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1).
* **Accessibility**: WCAG 2.1 AA compliance built into every component.
* **Animation**: Framer Motion with 60fps performance and reduced-motion support.
* **Responsive**: Mobile-first with progressive enhancement across breakpoints.

---

## Quality Gates — PR Checklist

* [ ] Lint & typecheck pass
* [ ] Unit/integration tests added or N/A with rationale
* [ ] Migrations present for any schema change; RLS reviewed
* [ ] Sentry logs clean for new code paths
* [ ] a11y checked (keyboard/contrast/labels)
* [ ] Docs updated (To-Do + Tech Doc)

---

## Conventional Commits Standard

All commits must use: `type(scope): summary`

**Types:** feat, fix, docs, style, refactor, test, chore
**Scopes:** auth, api, ui, db, ai, payments, etc.

**Examples:**
- `feat(auth): implement supabase email login`
- `fix(api): handle rate limiting in AI router`
- `docs(tech): update phase 1 completion status`
