# Graphify Setup

Project-local Graphify configuration for [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify).

## What is installed

| Artifact                     | Purpose                                                   |
| ---------------------------- | --------------------------------------------------------- |
| `.cursor/rules/graphify.mdc` | Always-on Cursor rule — query graph before Read/Grep/Glob |
| `.graphifyignore`            | Extra ignore patterns for graph extraction                |
| `graphify-out/`              | Local knowledge graph (gitignored, regenerated per clone) |
| `.husky/post-merge`          | Auto-refresh graph after `git pull` / merge               |

## First-time setup (new clone)

```bash
pnpm install
pnpm bootstrap
```

`pnpm bootstrap` handles env, Prisma, and Graphify. Install the CLI first if you want the knowledge graph:

```bash
uv tool install graphifyy
pnpm bootstrap
```

Bootstrap always builds or updates the graph when the CLI is available.

## Daily workflow

| Action                     | Command                                                       |
| -------------------------- | ------------------------------------------------------------- |
| Explore codebase in Cursor | Ask agent to run `graphify query "..."` first                 |
| After editing code         | `pnpm graphify:update`                                        |
| After `git pull`           | Automatic via `.husky/post-merge` (or `pnpm graphify:update`) |
| Regenerate report          | `pnpm graphify:report`                                        |
| Open visual graph          | `pnpm graphify:viz` then open `graphify-out/graph.html`       |

## Query commands

```bash
graphify query "what connects auth to the database?"
graphify path "AuthProvider" "prisma"
graphify explain "proxy"
```

## Team git workflow

- `graphify-out/` is **gitignored** — each developer maintains a local copy
- Graph is regenerated on **fresh clone** (`pnpm bootstrap`) and after **pull/merge** (`.husky/post-merge`)
- No merge conflicts on `graph.json`; no committed graph artifacts
- Optional: Graphify post-commit hook (from `graphify hook install`) keeps local graph fresh between pulls — outputs stay local

## Optional: docs and PDFs

Code-only extraction (default, no API key):

```bash
pnpm graphify:build
```

To include markdown docs and PDFs, set an LLM backend and run without `--code-only`:

```bash
graphify extract . --backend gemini   # requires GOOGLE_API_KEY
```

## Troubleshooting

| Issue                              | Fix                                                                 |
| ---------------------------------- | ------------------------------------------------------------------- |
| `graphify: command not found`      | Run `uv tool install graphifyy && uv tool update-shell`             |
| Stale graph after pull             | `pnpm graphify:update` (or re-run `git pull` to trigger post-merge) |
| Graph missing nodes after refactor | `graphify extract . --code-only --force`                            |
| Cursor not using graph             | Confirm `.cursor/rules/graphify.mdc` has `alwaysApply: true`        |
| No graph after clone               | Run `pnpm bootstrap` with Graphify CLI installed                    |
