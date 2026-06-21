# CLAUDE.md

Project-level protocols for any Coding_Agent-managed project. Self-contained — assumes the global `~/.claude/CLAUDE.md` is generic. Copied into target projects by `bin/init_project.sh`; keep it framework-general.

## Boot

Read in order, stop when context is sufficient:
1. `.workspace/state/SESSION.md` — current focus + danger zones
2. `.workspace/state/SCRATCHPAD.md` — shared coordination
3. `.workspace/state/NOTEPAD.md` — decision log
4. `.workspace/tracks/<active-id>/plan.md` — active track plan (if any)
5. `.agent/memory/LESSONS.md` — project lessons (skim)

If `SESSION.md` is missing or empty → `assessment:framework` (brownfield) or `brainstorming` (greenfield).

## Skill routing

`.claude/skills/SKILL_INDEX.md` is authoritative — check it before guessing a skill name.

**Auto-trigger:** `agents-context` (session start) · `conductor` (anything needing a plan) · `git-context` (before code changes) · `test-driven-development` (ALL code changes) · `security-audit` (threat models, SBOMs)

**On-demand:** see SKILL_INDEX.md.

## Inline plan

Before multi-step work, emit:
```
PLAN:
1. [step]
2. [step]
→ Executing unless redirected.
```
Skip for single-file or single-function changes.

## Pre-flight

Before non-trivial edits:
- State load-bearing assumptions out loud; never infer silently.
- Touch only what the task requires. No drive-by refactors or opportunistic cleanup.
- On conflicting patterns in the codebase, pick one coherent pattern and follow it — never average two.
- Surface uncertainty in output (`needs input:`, open questions). Never hide it behind confident phrasing.
- For deterministic transforms (migrations, mass renames, codegen), prefer a script over LLM judgment.

## Conflict + push-back

**Conflict:** STOP → `CONFUSION: X says A, Y says B. Options: A)… B)… C) Ask. → Which?` → wait.

**Push back:** name the concrete problem, propose an alternative, accept the human's decision. False agreement is failure.

## Iron rules

1. `conductor:newTrack` for anything needing a plan
2. TDD: failing test before implementation
3. Parallel over serial when independent (worktrees + SCRATCHPAD file ownership)
4. Subagents: `Task` tool; pass agent `.md` path as context
5. Errors → `retro` skill → append to `.agent/memory/LESSONS.md`

## Canonical state paths

| Purpose | Path |
|---|---|
| Active session focus | `.workspace/state/SESSION.md` |
| Shared coordination | `.workspace/state/SCRATCHPAD.md` |
| Decision log | `.workspace/state/NOTEPAD.md` |
| Per-track specs / plans | `.workspace/tracks/<id>/` |
| Project lessons | `.agent/memory/LESSONS.md` |
| System rules | `.agent/STANDARDS.md` |
| Decisions audit (schema / data) | `.workspace/STANDARDS.md` / `.workspace/state/decisions.jsonl` |

Announce skill use: *"I'm using [skill] to [purpose]."*

## Optional: graphify

If `.workspace/graphify-out/` exists, read `GRAPH_REPORT.md` there before architecture questions. After non-trivial code edits, rebuild:
```bash
python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
```
