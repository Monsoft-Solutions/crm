#!/usr/bin/env bash
set -euo pipefail

# claude-wt.sh — Git worktree lifecycle helper for parallel Claude Code sessions
# Usage: ./scripts/claude-wt.sh <command> [args]
#   new <branch-name> [base-branch]  — Create worktree + branch, install deps
#   list                              — Show active worktrees
#   clean                             — Remove merged worktrees (interactive)
#   remove <name>                     — Remove a specific worktree

REPO_ROOT="$(git -C "$(dirname "$0")/.." rev-parse --show-toplevel)"
WORKTREE_DIR="$(dirname "$REPO_ROOT")/worktrees"

slugify() {
    echo "$1" | sed 's|/|-|g' | tr '[:upper:]' '[:lower:]'
}

cmd_new() {
    local branch="${1:?Usage: claude-wt.sh new <branch-name> [base-branch]}"
    local base="${2:-main}"
    local slug
    slug="crm-$(slugify "$branch")"
    local wt_path="$WORKTREE_DIR/$slug"

    if [ -d "$wt_path" ]; then
        echo "Error: Worktree already exists at $wt_path"
        exit 1
    fi

    mkdir -p "$WORKTREE_DIR"

    echo "Creating worktree: $wt_path (branch: $branch, base: $base)"
    git -C "$REPO_ROOT" worktree add "$wt_path" -b "$branch" "$base"

    # Copy env config files if they exist
    for env_file in .env-cmdrc .env.local; do
        local env_src="$REPO_ROOT/monsoft-crm-app/$env_file"
        local env_dst="$wt_path/monsoft-crm-app/$env_file"
        if [ -f "$env_src" ]; then
            echo "Copying $env_file to worktree..."
            cp "$env_src" "$env_dst"
        fi
    done

    # Install dependencies (--ignore-scripts to skip husky prepare in worktrees)
    echo "Installing dependencies in worktree..."
    (cd "$wt_path" && npm install --ignore-scripts)
    (cd "$wt_path/monsoft-crm-app" && npm install --ignore-scripts)

    echo ""
    echo "Worktree ready at: $wt_path"
    echo "To start a Claude session:"
    echo "  cd $wt_path && claude"
}

cmd_list() {
    echo "Active worktrees:"
    echo ""
    git -C "$REPO_ROOT" worktree list --porcelain | awk '
        /^worktree / { path = substr($0, 10) }
        /^HEAD /     { head = substr($2, 1, 7) }
        /^branch /   { branch = substr($0, 8); gsub("refs/heads/", "", branch) }
        /^$/ {
            printf "  %-50s %-30s %s\n", path, branch, head
            path = ""; head = ""; branch = "(detached)"
        }
        END {
            if (path != "") printf "  %-50s %-30s %s\n", path, branch, head
        }
    '
}

cmd_clean() {
    local merged
    merged=$(git -C "$REPO_ROOT" branch --merged main | grep -v '^\*' | grep -v 'main' | sed 's/^  //' || true)

    if [ -z "$merged" ]; then
        echo "No merged branches found."
        return
    fi

    echo "Merged branches with worktrees:"
    for branch in $merged; do
        local slug
        slug="crm-$(slugify "$branch")"
        local wt_path="$WORKTREE_DIR/$slug"
        if [ -d "$wt_path" ]; then
            echo "  $branch -> $wt_path"
            read -r -p "  Remove? [y/N] " confirm
            if [[ "$confirm" =~ ^[Yy]$ ]]; then
                git -C "$REPO_ROOT" worktree remove "$wt_path"
                git -C "$REPO_ROOT" branch -d "$branch" 2>/dev/null || true
                echo "  Removed."
            fi
        fi
    done
}

cmd_remove() {
    local name="${1:?Usage: claude-wt.sh remove <name>}"
    local slug
    slug="crm-$(slugify "$name")"
    local wt_path="$WORKTREE_DIR/$slug"

    if [ ! -d "$wt_path" ]; then
        # Try partial match
        local match
        match=$(find "$WORKTREE_DIR" -maxdepth 1 -type d -name "*$(slugify "$name")*" 2>/dev/null | head -1)
        if [ -n "$match" ]; then
            wt_path="$match"
            echo "Matched: $wt_path"
        else
            echo "Error: No worktree found matching '$name'"
            echo "Use 'claude-wt.sh list' to see active worktrees."
            exit 1
        fi
    fi

    echo "Removing worktree: $wt_path"
    git -C "$REPO_ROOT" worktree remove "$wt_path"

    # Try to get the branch name and delete if merged
    local branch
    branch=$(basename "$wt_path" | sed 's/^crm-//' | sed 's/-/\//1')
    if git -C "$REPO_ROOT" branch --merged main | grep -q "$branch"; then
        git -C "$REPO_ROOT" branch -d "$branch" 2>/dev/null && echo "Deleted merged branch: $branch" || true
    fi

    echo "Done."
}

case "${1:-help}" in
    new)    shift; cmd_new "$@" ;;
    list)   cmd_list ;;
    clean)  cmd_clean ;;
    remove) shift; cmd_remove "$@" ;;
    *)
        echo "Usage: claude-wt.sh <command> [args]"
        echo ""
        echo "Commands:"
        echo "  new <branch> [base]  Create worktree + branch, install deps"
        echo "  list                 Show active worktrees"
        echo "  clean                Remove merged worktrees (interactive)"
        echo "  remove <name>        Remove a specific worktree"
        ;;
esac
