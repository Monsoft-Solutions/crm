# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monsoft CRM — an ABA therapy note-generation platform. Full-stack TypeScript monorepo with a tRPC API, React frontend, Drizzle ORM on PostgreSQL, and Better-Auth authentication.

**GitHub:** `Monsoft-Solutions/monsoft-crm`

## Commands

All app commands run from `monsoft-crm-app/`. The root `package.json` only has `npm run check` (runs turbo across workspaces) and docs commands.

```bash
# Development
cd monsoft-crm-app
npm run dev          # Start server + web + dev-connect in parallel (uses local env)
npm run build        # Build server + web (uses local env)
npm run start        # Build then run (uses local env)

# Checks (run from monsoft-crm-app/)
npm run check        # Full check: build + tsc + prettier + eslint + env check
npm run check:ts     # TypeScript only
npm run check:fmt    # Prettier only
npm run check:lint   # ESLint only

# Database (run from monsoft-crm-app/)
npm run generate     # Generate Drizzle migrations
npm run migrate      # Run migrations (local)
npm run migrate:prod # Run migrations (prod)
npm run seed         # Seed database (local)
npm run data         # Full reset: drop + create + generate + migrate + seed

# Auth
npm run auth         # Regenerate Better-Auth tables

# Formatting
npm run fmt          # Auto-format with Prettier
```

## Architecture

### Monorepo Structure

```
crm/                          # Root workspace (npm workspaces + Turbo)
├── monsoft-crm-app/          # Main application
│   ├── bases/                # Infrastructure layer (DO NOT modify patterns)
│   ├── mods/                 # Feature modules (where most work happens)
│   ├── app/                  # Integration layer (re-exports from all mods)
│   ├── routes/               # TanStack Router file-based routes
│   └── shared/               # Shared UI components and hooks
└── packages/                 # Workspace packages (typescript-config, etc.)
```

### bases/ vs mods/

- **bases/** — Framework-level infrastructure: `api`, `auth`, `db`, `errors`, `events`, `guard`, `twilio`, `meta`, `email`, `ai`, `conf`, `env`, `log`, `web`. These establish patterns and should not be structurally modified.
- **mods/** — Feature/domain modules: `contact`, `contact-message`, `contact-channel`, `brand`, `product`, `template`, `assistant`. Each is self-contained with its own api, db, components, schemas, providers, etc.

### Module Structure

Each mod follows a strict directory convention:

```
mods/<module>/
├── api/                # tRPC endpoints
│   ├── <module>.api.ts # Gateway file (single export via endpoints())
│   ├── *.query.ts      # Query endpoints
│   ├── *.mutation.ts   # Mutation endpoints
│   ├── *.subscription.ts
│   └── index.ts        # Barrel: ONLY re-exports the gateway, NOT individual endpoints
├── db/                 # Drizzle table definitions (one table per file)
├── components/         # React components (*.component.tsx)
├── schemas/            # Zod schemas (one per file, with inferred type)
├── enums/              # Zod enums (z.enum([...]))
├── providers/          # Business logic (impure functions)
│   ├── server/         # Server-side providers
│   └── web/            # Client-side providers
├── events/             # Event schemas (*.event.ts)
├── hub/                # Event listeners (*.listener.ts)
├── guards/             # Role definitions (*.role.ts)
├── res/                # Resource access control matrices (*.res.ts)
├── views/              # Page components (*.view.tsx)
├── constants/          # Constants (*.constant.ts)
├── types/              # TypeScript types (*.type.ts)
└── utils/              # Pure utility functions (*.util.ts)
```

### App Integration

When adding a new mod capability, integrate it by adding a re-export line to the corresponding `app/` file:

- `app/api/app.api.ts` — API gateway
- `app/db/app.tables.ts` — DB tables (use relative `../../mods/<module>/db`)
- `app/events/app.events.ts` — Events
- `app/guard/app.roles.ts` — Roles
- `app/hub/app.listeners.ts` — Listeners
- `app/res/app.res.ts` — Resources
- `app/seed/app.seed.ts` — Seeds

### Path Aliases

Defined in `monsoft-crm-app/tsconfig.json`. Key aliases:

| Alias       | Path             |
| ----------- | ---------------- |
| `@api/*`    | `bases/api/*`    |
| `@db/*`     | `bases/db/*`     |
| `@auth/*`   | `bases/auth/*`   |
| `@errors/*` | `bases/errors/*` |
| `@events/*` | `bases/events/*` |
| `@guard/*`  | `bases/guard/*`  |
| `@mods/*`   | `mods/*`         |
| `@shared/*` | `shared/*`       |
| `@ui/*`     | `shared/ui/*`    |
| `@conf/*`   | `bases/conf/*`   |
| `@routes/*` | `routes/*`       |
| `@twilio/*` | `bases/twilio/*` |
| `@meta/*`   | `bases/meta/*`   |
| `@email/*`  | `bases/email/*`  |
| `@ai/*`     | `bases/ai/*`     |
| `@css/*`    | `bases/css/*`    |
| `@env/*`    | `bases/env/*`    |
| `@log/*`    | `bases/log/*`    |

## Key Patterns

### Error Handling (Result Type)

All providers and endpoints use a consistent Result pattern:

```typescript
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

const { data, error } = await catchError(db.query.someTable.findFirst(...));
if (error) return Error('DESCRIPTIVE_CODE');
return Success(data);
```

Providers are typed with `satisfies Function<Input, Output>` from `@errors/types`.

### tRPC Endpoints

Queries and mutations use `protectedEndpoint` with `queryMutationCallback`:

```typescript
import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const getItem = protectedEndpoint
    .input(z.object({ id: z.string() }))
    .query(
        queryMutationCallback(
            async ({
                ctx: {
                    session: { user },
                },
                input: { id },
            }) => {
                ensurePermission({ user, resource: 'item', action: 'read' });
                // ... database query with catchError
                return Success(data);
            },
        ),
    );
```

Subscriptions use `subscribe()` from `@api/providers/server`:

```typescript
export const onItemCreated = protectedEndpoint
    .input(z.object({ ... }))
    .subscription(subscribe('itemCreated', ({ ctx, input, data }) => data));
```

### Event System

Events are emitted without await: `emit({ event: 'eventName', payload: data })`. Event schemas are Zod objects in `*.event.ts` files. Listeners use `listen('eventName', callback)` in `*.listener.ts` files.

### Database Tables

- Import column types from `@db/sql` (not directly from `drizzle-orm`)
- Import related tables from `'../../../bases/db/db.tables'`
- Use `bigint` for timestamps
- PostgreSQL columns use snake_case, TypeScript fields use camelCase
- One table per file with its relations

### Components & UI

- shadcn/ui components live in `shared/ui/*.ui.tsx`, imported via `@ui/<name>`
- Use `ReactElement` return type for components
- Forms: always use `react-hook-form` with Zod resolvers, never manual useState
- Routes use TanStack Router with `*.lazy.tsx` files and `createLazyFileRoute`

## Code Style

- **Types over interfaces**: ESLint enforces `@typescript-eslint/consistent-type-definitions: ['error', 'type']`
- **camelCase** for variables/functions, **PascalCase** for types (never prefix with `I`)
- **kebab-case** file names with descriptive suffixes (`.provider.ts`, `.query.ts`, `.table.ts`, etc.)
- Unused variables: prefix with `_` (enforced by ESLint)
- Switch statements must be exhaustive (enforced by ESLint)
- Leave blank lines between import groups and between logical sections for readability
- Endpoint inputs: use primitive Zod schemas without specific constraints like `.uuid()` or `.email()`

## Tech Stack

| Layer      | Technology                                                  |
| ---------- | ----------------------------------------------------------- |
| Frontend   | React 18, TanStack Router, TanStack React Query             |
| API        | tRPC 11 (RC) on Express                                     |
| Database   | Drizzle ORM, PostgreSQL                                     |
| Auth       | Better-Auth with Google OAuth                               |
| Styling    | Tailwind CSS 4, shadcn/ui (Radix), class-variance-authority |
| Forms      | React Hook Form + Zod                                       |
| AI         | Vercel AI SDK (Anthropic + OpenAI), Langfuse tracing        |
| Messaging  | Twilio (SMS), Meta (WhatsApp), Resend (email)               |
| Build      | Vite (web), tsup (server), Turbo (orchestration)            |
| Monitoring | Sentry, Winston, Clarity, GA4                               |

## Agent Memory

This project uses an agent memory system in `agents-notes/` to persist learnings across sessions.

- **Capture notes:** Use `/note [category] <content>` or let Claude auto-capture during work
- **Recall notes:** Use `/recall [search query]` before starting a task
- **Categories:** `errors`, `patterns`, `decisions`, `tips`, `context`
- **Notes location:** See `agents-notes/README.md` for full documentation

Before starting a task, check if relevant notes exist. After solving non-trivial problems, capture the learning.

## Testing the UI in local

- When testing the UI, use these credentials:
- crm@monsoftsolutions.com
- monsoftPass?2026
