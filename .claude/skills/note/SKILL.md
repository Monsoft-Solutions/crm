---
name: note
description: Capture a learning, error fix, pattern, decision, tip, or context note into agents-notes/. Use when discovering something noteworthy — an error and its fix, a codebase pattern, a design decision, a useful shortcut, or domain context.
argument-hint: "[category] <content>"
---

# Procedure

1. **Parse arguments from `$ARGUMENTS`:**
   - If the first word matches one of `errors`, `patterns`, `decisions`, `tips`, `context` — use it as the category and the rest as content
   - Otherwise, auto-detect category from content:
     - Contains "error", "fix", "bug", "issue", "broke", "failed" → `errors`
     - Contains "pattern", "convention", "structure", "always", "never" → `patterns`
     - Contains "decided", "chose", "why", "tradeoff", "because" → `decisions`
     - Contains "tip", "shortcut", "trick", "fast", "quick", "useful" → `tips`
     - Default → `context`

2. **Generate filename:**
   - Extract key topic words from the content (max 5 words)
   - Convert to kebab-case with `.md` extension
   - Example: "drizzle relation loading fix" → `drizzle-relation-loading.md`

3. **Check for existing similar note:**
   - Use Grep to search `agents-notes/<category>/` for key terms from the content
   - If a closely related note exists, read it and append an update section:
     ```markdown
     ## Update (YYYY-MM-DD)

     <new content>
     ```
   - If no related note exists, create a new file

4. **Create new note using this template:**

   ```markdown
   # <Title>

   **Category:** <category>
   **Date:** <today's date YYYY-MM-DD>
   **Tags:** <3-5 relevant tags>

   ## Summary

   <1-3 sentence summary>

   ## Details

   <Full explanation with code snippets if helpful>

   ## Related

   - <relevant file paths, commands, or other note references>
   ```

5. **Keep notes under 30 lines.** Be concise — focus on what someone needs to know to avoid repeating the same mistake or rediscovering the same solution.

6. **Confirm to the user:** Report the file path created/updated and a one-line summary.
