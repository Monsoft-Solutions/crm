---
name: worktree
description: Create, list, and manage git worktrees for parallel Claude Code development sessions. Use when starting a new feature, bugfix, or task that benefits from code isolation.
argument-hint: "new <branch-name> | list | clean | remove <name>"
---

# Procedure

Parse `$ARGUMENTS` to determine the subcommand and arguments.

## `new <branch-name> [base-branch]`

1. Extract branch name from arguments. If a second argument is provided, use it as the base branch (default: `main`).
2. Sanitize the branch name to a kebab-case slug by replacing `/` with `-` and lowercasing.
3. Run the following using Bash:
   ```bash
   bash scripts/claude-wt.sh new <branch-name> [base-branch]
   ```
4. Report the worktree path and suggest:
   - Open a new terminal
   - `cd ../worktrees/crm-<slug> && claude`

## `list`

1. Run using Bash:
   ```bash
   bash scripts/claude-wt.sh list
   ```
2. Format the output as a readable table showing path, branch, and HEAD commit.

## `clean`

1. Inform the user this will check for merged worktrees and prompt for removal.
2. Run using Bash (this is interactive, requires user confirmation):
   ```bash
   bash scripts/claude-wt.sh clean
   ```
3. Report which worktrees were removed.

## `remove <name>`

1. Extract the worktree name from arguments.
2. Run using Bash:
   ```bash
   bash scripts/claude-wt.sh remove <name>
   ```
3. Report whether the worktree and branch were removed.

## No arguments or `help`

Display available commands:
- `/worktree new feat/contact-import` — Create worktree + branch, install deps, suggests launching Claude
- `/worktree list` — Show active worktrees with branch and status
- `/worktree clean` — Remove merged worktrees (interactive)
- `/worktree remove <name>` — Remove a specific worktree

## Important

- Worktrees are created in `../worktrees/crm-<branch-slug>/` (sibling to the main repo)
- `.env.local` is automatically copied from the main repo if it exists
- `npm install` is run automatically in the new worktree
- Each worktree can have its own independent Claude Code session
