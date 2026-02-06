# Git Worktree Parallel Development

**Category:** tips
**Date:** 2026-02-06
**Tags:** git, worktree, parallel, development, workflow

## Summary

Use git worktrees to run multiple Claude Code sessions in parallel, each with isolated code on separate branches. Worktrees share the same git history but have independent working directories.

## Details

**Create a worktree:** `/worktree new feat/my-feature` or `bash scripts/claude-wt.sh new feat/my-feature`

**Naming convention:** Worktrees live in `../worktrees/crm-<branch-slug>/` (sibling to main repo).

**Setup reminders:**
- `monsoft-crm-app/.env-cmdrc` is auto-copied by the script, but verify if other untracked config exists
- `npm install` runs automatically in the new worktree
- Each worktree needs its own terminal and Claude Code session

**Cleanup:** `/worktree clean` removes worktrees whose branches are merged into main.

## Related

- `scripts/claude-wt.sh` — Shell helper for worktree lifecycle
- `.claude/skills/worktree/SKILL.md` — Claude Code skill definition
