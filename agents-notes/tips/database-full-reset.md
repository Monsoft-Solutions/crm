# Database Full Reset

**Category:** tips
**Date:** 2026-02-06
**Tags:** database, reset, seed, migrations, drizzle

## Summary

Use `npm run data` from `monsoft-crm-app/` to fully reset the local database. This drops, recreates, generates migrations, runs them, and seeds — all in one command.

## Details

```bash
cd monsoft-crm-app
npm run data    # drop + create + generate + migrate + seed
```

Individual steps if needed:
- `npm run generate` — Generate Drizzle migrations after schema changes
- `npm run migrate` — Run migrations (local)
- `npm run migrate:prod` — Run migrations (production)
- `npm run seed` — Seed database with test data

Use `npm run data` when schema changes are causing issues or you need a clean slate.

## Related

- `monsoft-crm-app/package.json` — script definitions
- `monsoft-crm-app/bases/db/` — Drizzle ORM configuration
