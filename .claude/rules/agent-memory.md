---
description: Agent memory system — persist and recall learnings across sessions
globs: *
---

# Agent Memory

This project uses an agent memory system in `agents-notes/` to persist learnings across sessions.

## Before starting work

- Check `agents-notes/` for relevant context using `/recall <topic>` or by grepping the notes directory
- This avoids re-discovering solutions to previously solved problems

## During work

- When you encounter and solve a non-trivial error, capture it with `/note errors <description>`
- When you discover a codebase pattern or convention, capture it with `/note patterns <description>`
- When a design decision is made, capture the rationale with `/note decisions <description>`

## After work

- Before a session ends, consider whether any learnings should be saved
- Particularly valuable: error fixes, non-obvious patterns, and domain context

## Quality guidelines

- Keep notes concise — one topic per file, under 30 lines
- Always include a `## Summary` section for quick scanning
- Update existing notes rather than creating duplicates
- Use descriptive kebab-case filenames (max 5 words)
