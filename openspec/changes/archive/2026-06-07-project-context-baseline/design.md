## Context

Lazy Trainer (`0.0.9`) is a React 19 + Vite 8 PWA deployed to GitHub Pages. It uses IndexedDB (Dexie v12) as the primary store, optionally mirrors writes to Supabase, and authenticates via Google OAuth client-side. Knowledge today lives in:

- `README.md` — product overview and getting started
- `docs/` — four focused guides (workouts data model, Supabase, Google login, GitHub Pages)
- `src/db/index.ts` — authoritative IndexedDB schema + 12 Dexie migrations
- `supabase/schema.sql` — PostgreSQL bootstrap DDL
- `.cursor/rules/` — version bump and DB migration conventions
- Source code — architecture patterns not written down anywhere

OpenSpec is newly initialized (`openspec/config.yaml` has empty context). AI agents and new contributors lack a single entry point.

## Goals / Non-Goals

**Goals:**

- Produce three durable reference docs under `docs/` that mirror the three OpenSpec capabilities.
- Populate `openspec/config.yaml` `context` block with stack, architecture, and conventions so future OpenSpec artifacts inherit project knowledge.
- Cross-link existing docs rather than duplicating them wholesale — baseline docs summarize and point to sources of truth.
- Document known gaps (no tests, open RLS, client-only JWT decode) explicitly.

**Non-Goals:**

- Changing application code or behavior.
- Writing user-facing product copy or marketing content.
- Creating automated doc generation or CI doc checks.
- Migrating Supabase schema to `db/migrations/` (convention exists in Cursor rules; folder not yet created).
- Full API reference for every function — focus on architecture and data flow.

## Decisions

### 1. Doc layout: three files under `docs/`

| File | Capability | Rationale |
|------|------------|-----------|
| `docs/PROJECT_CONTEXT.md` | `project-context` | Single architecture entry point |
| `docs/DATA_MODEL.md` | `data-model` | Extends `DATABASE_WORKOUTS.md`; adds full schema + Supabase mapping |
| `docs/DEVELOPER_WORKFLOW.md` | `developer-workflow` | Consolidates setup from README + existing guides |

**Alternative considered:** one monolithic `docs/ARCHITECTURE.md`. Rejected — too long for targeted lookup; three files match OpenSpec capabilities and allow partial updates.

### 2. Keep `DATABASE_WORKOUTS.md` as workout-specific deep dive

`DATA_MODEL.md` will reference and summarize it rather than merge/replace. Workout import JSON examples stay where they are.

### 3. OpenSpec context in `openspec/config.yaml`

Add a concise (~40-line) `context:` block with stack, key paths, and conventions. Full detail stays in `docs/`; config holds what agents need on every artifact.

**Alternative considered:** only docs, no config. Rejected — OpenSpec reads config automatically; duplicating a short summary there reduces agent re-reads.

### 4. Source-of-truth hierarchy

When docs and code disagree, code wins — audit must verify against `src/db/index.ts`, `supabase/schema.sql`, and `App.tsx` before writing.

### 5. Language

Docs in English (matches existing `docs/` and README). Product UI remains bilingual (en/ru).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Docs drift from code over time | Link to source files; note Dexie version number and `APP_VERSION`; add "last verified" date in each doc |
| Over-documentation becomes stale noise | Keep docs scannable: tables, diagrams, links — not prose dumps |
| Duplication with README | README stays user-facing quick start; new docs are developer/AI reference |
| Supabase `schema.sql` vs future `db/migrations/` | Document both: `schema.sql` is bootstrap; new DDL goes to `db/migrations/` per Cursor rule |

## Migration Plan

N/A — documentation-only change. No deploy or rollback needed. Merge docs + config update in a single PR.

## Open Questions

- Should `README.md` link to the three new docs? (Recommended yes — one-line additions under "Documentation".)
- Should `DATABASE_WORKOUTS.md` be renamed or left as-is? (Recommended leave; cross-link from `DATA_MODEL.md`.)
