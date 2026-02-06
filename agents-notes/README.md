# Agent Notes

Persistent memory system for Claude Code sessions. Notes are organized by category and shared across all sessions via git.

## Categories

| Folder       | Purpose                                      | Example                              |
| ------------ | -------------------------------------------- | ------------------------------------ |
| `errors/`    | Errors encountered and their fixes            | `drizzle-relation-loading.md`        |
| `patterns/`  | Codebase patterns and conventions             | `result-type-error-handling.md`      |
| `decisions/` | Design decisions and rationale                | `why-trpc-over-rest.md`              |
| `tips/`      | Shortcuts and workflow tricks                 | `database-full-reset.md`             |
| `context/`   | Domain knowledge (ABA therapy, CRM workflows) | `aba-session-note-structure.md`      |

## Usage

### Capture a note

```
/note [category] <content>
```

Category is auto-detected if omitted. Examples:

- `/note errors Got "relation not found" when querying contacts — fix was to add .with() clause`
- `/note patterns The gateway pattern: each mod's API has a single gateway file that exports endpoints()`
- `/note tips Use npm run data from monsoft-crm-app/ to fully reset the database`

### Recall notes

```
/recall [search query]
```

- `/recall` — Show summary table of all notes
- `/recall drizzle` — Search for notes matching "drizzle"
- `/recall error handling` — Find notes about error handling patterns

## Note Format

Each note follows this template:

```markdown
# <Title>

**Category:** errors | patterns | decisions | tips | context
**Date:** YYYY-MM-DD
**Tags:** tag1, tag2, tag3

## Summary

One to three sentences.

## Details

Full explanation, code snippets if helpful.

## Related

- Relevant file paths or other notes
```

## Maintenance

- **One topic per file** — keep notes focused and searchable
- **Keep notes under 30 lines** — concise is better
- **Consolidate** when a folder exceeds 15 notes — merge related notes
- **Update existing notes** rather than creating duplicates
- **kebab-case filenames** with `.md` extension (max 5 words)
