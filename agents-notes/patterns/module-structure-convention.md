# Module Structure Convention

**Category:** patterns
**Date:** 2026-02-06
**Tags:** modules, mods, architecture, gateway-pattern

## Summary

Each feature module in `mods/` follows a strict directory structure. The API uses a gateway pattern where a single `<module>.api.ts` file exports all endpoints via `endpoints()`. The barrel `index.ts` only re-exports the gateway, never individual endpoints.

## Details

Standard mod directories: `api/`, `db/`, `components/`, `schemas/`, `enums/`, `providers/{server,web}/`, `events/`, `hub/`, `guards/`, `res/`, `views/`, `constants/`, `types/`, `utils/`.

API gateway pattern:
- `<module>.api.ts` — single gateway file that calls `endpoints()` to bundle all queries/mutations
- `*.query.ts` — individual query endpoints
- `*.mutation.ts` — individual mutation endpoints
- `index.ts` — barrel that ONLY re-exports the gateway

When adding new mod capabilities, register them in the corresponding `app/` integration file (e.g., `app/api/app.api.ts`, `app/db/app.tables.ts`).

## Related

- `monsoft-crm-app/mods/` — all feature modules
- `monsoft-crm-app/app/` — integration layer
- `CLAUDE.md` — Module Structure and App Integration sections
