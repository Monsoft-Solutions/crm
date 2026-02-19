# Drizzle Kit Generate is Interactive

## Summary

`npm run generate` (drizzle-kit generate) prompts interactively when columns are added/removed. It asks whether new columns were "created" or "renamed from" existing ones. This cannot be piped or automated easily - the user must run it manually.

## Workaround

Flag the need for migration generation early and let the user handle it, or write the migration SQL manually in `drizzle/postgresql/`.
