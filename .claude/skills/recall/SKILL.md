---
name: recall
description: Search and retrieve relevant notes from agents-notes/ before starting work. Use when beginning a task, encountering a familiar error, or when context from previous sessions would help.
argument-hint: "[search query or topic]"
allowed-tools: Read, Grep, Glob
---

# Procedure

## No arguments — show summary

If `$ARGUMENTS` is empty:

1. Use Glob to list all files in `agents-notes/**/*.md` (excluding README.md)
2. Group by category folder
3. Present a summary table:

   ```
   | Category  | Count | Recent Notes                          |
   | --------- | ----- | ------------------------------------- |
   | errors    | 3     | drizzle-relation-loading.md, ...      |
   | patterns  | 5     | result-type-error-handling.md, ...    |
   | decisions | 1     | why-trpc-over-rest.md                 |
   | tips      | 2     | database-full-reset.md, ...           |
   | context   | 0     | —                                     |
   ```

4. Include total count and a reminder: `Use /recall <query> to search for specific topics.`

## With arguments — search and present

If `$ARGUMENTS` contains a search query:

1. **Search file contents:** Use Grep to search `agents-notes/**/*.md` for the query terms (case-insensitive)
2. **Search filenames:** Use Glob to match `agents-notes/**/*<query-term>*.md`
3. **Combine results:** Deduplicate matches from both searches
4. **Read top matches:** Read up to 5 most relevant notes
5. **Present concise summaries:** For each note, show:
   - File path
   - The `## Summary` section content
   - Tags if present

6. If no matches found, suggest:
   - Broader search terms
   - Checking `/recall` (no args) to browse all notes
   - The note might not exist yet — consider using `/note` to capture it

## Important

- **Read-only** — never modify or create notes during recall
- **Be concise** — show summaries, not full note contents (user can read the full file if needed)
- **Prioritize relevance** — if many matches, show the most relevant ones first
