## Why

Lazy Trainer is a mature offline-first PWA with IndexedDB, optional Supabase backup, Google auth, and bilingual UI — but project knowledge is scattered across README, ad-hoc docs, source code, and Cursor rules. Without a consolidated baseline, every new change (human or AI) requires re-discovering architecture, data models, and conventions from scratch. This change captures that context once, in a structured form OpenSpec and future work can rely on.

## What Changes

- Audit the existing codebase, docs, CI, and Cursor rules to extract authoritative facts (not assumptions).
- Create structured baseline documentation under `docs/` and/or `openspec/` project context.
- Populate `openspec/config.yaml` project context so OpenSpec artifacts inherit stack and conventions automatically.
- Document IndexedDB (Dexie v12) schema, Supabase mirror model, auth flow, feature modules, i18n, and deployment pipeline.
- Record gaps and conventions (e.g. no test runner, state-based routing, fire-and-forget Supabase sync).
- No application behavior changes — documentation and context only.

## Capabilities

### New Capabilities

- `project-context`: Consolidated baseline covering tech stack, app architecture, navigation/state patterns, feature map, and code conventions.
- `data-model`: IndexedDB tables, Dexie migration history summary, Supabase schema mapping, import/export format, and sync/restore behavior.
- `developer-workflow`: Environment variables, local dev, Google OAuth setup, Supabase setup, GitHub Pages deploy, Cursor rules, and OpenSpec usage.

### Modified Capabilities

<!-- No existing specs in openspec/specs/ — nothing to modify -->

## Impact

- **Docs:** new or expanded files in `docs/`; updated `openspec/config.yaml` context block.
- **Code:** none (read-only audit).
- **Dependencies:** none.
- **Systems:** none — no runtime, schema, or API changes.
