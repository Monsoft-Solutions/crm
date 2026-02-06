---
allowed-tools:
    - 'Bash(npm run:*)'
description: 'Run project checks (build, tsc, prettier, eslint, env) and auto-fix formatting issues'
model: sonnet
---

Run the full project check suite from `monsoft-crm-app/` and auto-fix what you can.

## Steps

1. Change to the `monsoft-crm-app/` directory and run `npm run check`.
2. Inspect the output for failures. The check pipeline runs these stages in order: **build**, **tsc**, **prettier**, **eslint**, **env**.
3. **If Prettier (`check:fmt`) fails:** run `npm run fmt` from `monsoft-crm-app/` to auto-fix formatting, then re-run `npm run check` to verify everything passes.
4. After all runs complete, provide a summary table showing **pass/fail** for each stage: build, tsc, prettier, eslint, env.

## Rules

- Only Prettier issues are auto-fixed. All other failures are reported for manual review.
- Always run commands from the `monsoft-crm-app/` directory.
- If the re-run after `npm run fmt` still fails on Prettier, report it as a failure.
