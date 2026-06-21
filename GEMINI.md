<!-- GENERATED: do not edit; source AGENTS.md + boot/gemini.md -->

# AGENTS.md
<!-- Repo-level context for AI coding agents (Gemini, Claude, open-swe, etc.)
     Read by agents at boot, before any other context file.
     Keep this file current — it is the single source of truth for agent behaviour on this repo. -->

## Architecture

This repo is the **Coding_Agent framework** — a portable, runtime-agnostic multi-agent system for AI-assisted software development. It is not a standalone application; it is applied to other working projects as their agent infrastructure.

**Major components:**

| Component | Path | Responsibility |
|:---|:---|:---|
| **Agent Definitions** | `.agent/` | Role specs for Orchestrator, Planner, Coder, Reviewer, Tester, DevOps, UI/UX, Tech Writer |
| **Shared Workflows** | `.agent/workflows/` | Protected protocols: iteration-loop, pre-merge-gate, escalation, git-commit, deployment-readiness |
| **Canonical Skills** | `skills/` | Source of truth for model-agnostic skill definitions |
| **Gemini Adapter** | `.gemini/` | Gemini runtime settings, hooks, indexes, and synced skill copies |
| **Claude Adapter** | `.claude/` | Claude Code runtime settings, commands, hooks, indexes, and synced skill copies |
| **Conductor System** | `.{gemini,claude}/skills/conductor/` | Spec-driven track lifecycle (newTrack -> spec -> plan -> implement) |
| **Workspace State** | `.workspace/state/` | SCRATCHPAD.md (shared state), SESSION.md (current focus), NOTEPAD.md (log) |
| **Tracks** | `.workspace/tracks/` | Active feature/bug tracks with spec.md and plan.md per track |
| **Standards** | `.agent/STANDARDS.md`, `.workspace/STANDARDS.md` | System-level and project-level coding/process standards |

**Data flow:** User request -> Orchestrator (path selection) -> Conductor track or Hot Path -> Agent delegation -> SCRATCHPAD coordination -> Verification -> Deployment

**Key boundary:** Shared skills and agent templates are authored in `skills/` and `.agent/` as canonical sources. Runtime adapters (`.claude/`, `.gemini/`) receive synced skills and compiled subagent profiles automatically via `bin/sync-skills.sh`.

**Architecture contract:** See `docs/architecture/model-agnostic-harness.md` for the simple layer model: one framework core, one canonical skill source, runtime adapters, optional apps, and generated workspace state.

## Conventions

- **Languages:** Python (uv package manager, ruff formatter/linter), JavaScript/TypeScript (bun or npm, prettier/eslint)
- **Git:** Conventional Commits, atomic commits per task, branch naming: `feature/<name>`, `fix/<name>`, `chore/<name>`
- **Skill format:** Each shared skill lives in `skills/<name>/SKILL.md` with YAML frontmatter and is synced into runtime adapter folders. Must include: Prerequisites, Inputs, Execution Steps, Expected Output, Fallback/Error Handling.
- **Agent format:** Each agent at `.agent/<role>/AGENT.md` with YAML frontmatter (name, description, version). Must include: Context, Task, Constraints, Required Skills, Output Format.
- **Naming:** Skills use kebab-case directories. Agents use snake_case directories.
- **Layer scope (narrowest-file rule):** keep `~/.claude/CLAUDE.md` / `~/.gemini/GEMINI.md` lean — only truly cross-project habits. Project protocols (boot, planning, state-file paths) live in the project's `CLAUDE.md` / `GEMINI.md` (also the template `bin/init_project.sh` copies into target projects); tool-specific rules live in the relevant `SKILL.md`. When recording a new rule, edit the narrowest applicable file; don't bubble up to global unless it's genuinely universal.
- **Iron Laws (non-negotiable):** TDD (failing test before code), Root Cause First (no fixes without investigation), Two-Gate Rule (spec approved before plan, plan approved before execution), Double-Review (every design output reviewed twice), Supply Chain (scan before adding any dependency).

## Testing

- **Python:** `uv run pytest` — requires `.venv` in project root
- **JavaScript/TypeScript:** `bun test` or `npx vitest`
- **TDD mandatory:** Write failing test first, then minimal code to pass, then refactor
- **Coverage:** Target >= 80%
- **Test signature:** After every test run, write `.workspace/state/last-test-run.txt` with ISO-8601-UTC timestamp
- **Test location:** `tests/` directory at project root

## Tool Preferences

**Prefer `safe_bash` over raw shell for any non-trivial command.**

`.agent/tools/safe_bash.py` is the policy-enforcing shell wrapper. Call it instead of raw Bash when:
- Running commands that could delete files, install packages, or mutate repo state
- Operating in autonomous mode (no human in the loop)
- Writing agent scripts or workflows that execute shell commands on behalf of a user

Usage:
```bash
python3 .agent/tools/safe_bash.py '{"command": "rm -rf dist/"}'
```
Returns structured JSON: `{"ok": true/false, "stdout": ..., "stderr": ..., "exit_code": ...}`.

Schema: `.agent/tools/safe_bash.json`. Runtime hooks (`dangerous_command_blocker.py`) remain active as defense-in-depth backstop — safe_bash is the preferred primary surface.

## Danger Zones

- **`.env` files** — Never commit secrets. Use `.env.example` as template.
- **`.workspace/state/SCRATCHPAD.md`** — Shared mutable state. Always read before writing. Never truncate without archiving.
- **`.agent/STANDARDS.md`** — Protected protocols section must never be removed or weakened.
- **Production configs** — Any file matching `**/config/production.*` requires human review.
- **Hook paths** — `.claude/settings.local.json` and `.gemini/settings.json` contain hook configurations. Broken paths block all Bash execution.
- **Conductor templates** — `.{gemini,claude}/skills/conductor/templates/` are shared scaffolds. Changes affect all new tracks.
- **Cross-runtime sync** — Editing runtime skill copies directly causes silent drift. Update `skills/` first, then sync and verify both `.gemini/skills/` and `.claude/skills/`.

## graphify

This project has a graphify knowledge graph at .workspace/graphify-out/.

Rules:
- Before answering architecture or codebase questions, read .workspace/graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If .workspace/graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current

---

# Gemini Runtime Layer

> Gemini-specific operational registries, boot sequence, and rules. The neutral
> framework context above (architecture, conventions, testing, tool preferences,
> danger zones) is shared with all runtimes via `AGENTS.md` and is the single
> source of truth — edit it there, then run `python3 bin/render_boot.py`.

## 🧠 Self-Learning Protocol
**Core Rule**: After each correction, update this file (or global `~/.gemini/GEMINI.md`). Refine and prune continuously.

## 🤖 Agent Registry
| Role | Resp | Path |
| :--- | :--- | :--- |
| **Orchestrator** | Start here. Delegates everything. | [.agent/orchestrator/AGENT.md](.agent/orchestrator/AGENT.md) |
| **Planner** | Specs, Arch, Plans. | [.agent/planner/AGENT.md](.agent/planner/AGENT.md) |
| **Coder** | Build. | *(Standard)* |
| **Reviewer** | Quality, Sec, Perf. | [.agent/code_reviewer/AGENT.md](.agent/code_reviewer/AGENT.md) |
| **Tester** | Plans, Auto-tests. | [.agent/tester/AGENT.md](.agent/tester/AGENT.md) |
| **DevOps** | Git, CI/CD, Docker. | [.agent/devops/AGENT.md](.agent/devops/AGENT.md) |
| **UI/UX** | Design, Styles. | [.agent/ui_ux/AGENT.md](.agent/ui_ux/AGENT.md) |
| **Writer** | API Docs, Guides. | [.agent/tech_writer/AGENT.md](.agent/tech_writer/AGENT.md) |

## 🛠️ Skills Registry
| Skill | When to Use | Priority |
| :--- | :--- | :--- |
| [conductor](.gemini/skills/conductor/SKILL.md) | Spec-driven development (Features/Bugs) | 🔴 First |
| [assessment](.gemini/skills/assessment/SKILL.md) | Brownfield/maintenance audit before newTrack | 🔴 First |
| [security-audit](.gemini/skills/security-audit/SKILL.md) | Architectural threat models, dependency scans, SBOMs | 🔴 First |
| [brainstorming](.gemini/skills/brainstorming/SKILL.md) | Before ANY creative work | 🔴 First |
| [prd](.gemini/skills/prd/SKILL.md) | Validated idea → specific, measurable PRD (between brainstorming and writing-plans) | 🟠 Second |
| [writing-plans](.gemini/skills/writing-plans/SKILL.md) | After design approval, before coding | 🔴 First |
| [executing-plans](.gemini/skills/executing-plans/SKILL.md) | When executing a plan | 🟠 Second |
| [test-driven-development](.gemini/skills/test-driven-development/SKILL.md) | ALL code changes | 🔴 First |
| [systematic-debugging](.gemini/skills/systematic-debugging/SKILL.md) | ANY bug or technical issue | 🔴 First |
| [retro](.gemini/skills/retro/SKILL.md) | After errors/track close → project LESSONS.md or global GEMINI.md. Weekly: commit history + trends. | 🟠 Second |
| [requesting-code-review](.gemini/skills/requesting-code-review/SKILL.md) | After tasks, before merge | 🟠 Second |
| [design-system](.gemini/skills/design-system/SKILL.md) | **Auto-trigger for new products/brands or audits**: tokens, components, voice & tone, a11y, docs. Commands: `create`, `audit`, `tokens`, `document` | 🔴 First (new product / design audit) |
| [frontend-design](.gemini/skills/frontend-design/SKILL.md) | Building web UIs (consumes design tokens, WCAG 2.1 AA enforced) | 🟠 Second |
| [explaining-code](.gemini/skills/explaining-code/SKILL.md) | Teaching/explaining code | 🟢 Optional |
| [todo-to-skill](.gemini/skills/todo-to-skill/SKILL.md) | Repetitive TODO patterns → skills | 🟢 Optional |
| [skill-eval](.gemini/skills/skill-eval/SKILL.md) | Eval, benchmark, compare & recursively improve skills | 🟠 Second |
| [git-context](.gemini/skills/git-context/SKILL.md) | Before any code change or plan | 🔴 First |
| [session-management](.gemini/skills/session-management/SKILL.md) | Pause/resume; `session:handoff` on retirement | 🟠 Second |
| [codebase-mapping](.gemini/skills/codebase-mapping/SKILL.md) | Brownfield codebase analysis | 🟠 Second |
| [devops-pipeline](.gemini/skills/devops-pipeline/SKILL.md) | CI/CD pipeline management/recovery | 🟠 Second |
| [environment-health](.gemini/skills/environment-health/SKILL.md) | Broken build/CI environment | 🔴 First |
| [agents-context](.gemini/skills/agents-context/SKILL.md) | Auto-discover `AGENTS.md` and inject repo context at every agent boot | 🔴 First (any new session) |
| [sandbox-exec](.gemini/skills/sandbox-exec/SKILL.md) | Isolate high-risk ops in uv venv or Docker; set `SANDBOX_MODE` in SCRATCHPAD | 🟠 Second |
| [async-invoke](.gemini/skills/async-invoke/SKILL.md) | Background agent dispatch with structured manifests + SCRATCHPAD ASYNC_JOBS tracking | 🟠 Second |
| [native-parallel](.gemini/skills/native-parallel/SKILL.md) | Parallel agent orchestration via Claude Task tool or Gemini async-invoke; handles lane planning | 🟠 Second |
| [supply-chain-scan](.gemini/skills/supply-chain-scan/SKILL.md) | **Auto-trigger on any new lib/package/GitHub ref**: typosquatting, CVE, install-script, provenance checks | 🔴 First (new dependency) |
| [architecture-design](.gemini/skills/architecture-design/SKILL.md) | **Auto-trigger for Planner**: C4 diagrams, ADRs, fitness evals, pattern trade-offs. All outputs require double-review (completeness → simpler alternative). | 🔴 First (Planner / architecture scope) |

> **Full Index:** [.gemini/skills/SKILL_INDEX.md](.gemini/skills/SKILL_INDEX.md)

## 📂 Artifact Standards
| Type | Path | Owner |
| :--- | :--- | :--- |
| **Tracks** | `.workspace/tracks/` | Orchestrator |
| **Specs** | `.workspace/tracks/<id>/spec.md` | Planner |
| **Plans** | `.workspace/tracks/<id>/plan.md` | Planner |
| **Docs** | `docs/` | Writer |
| **Tests** | `tests/` | Tester |
| **Sys Standards** | [.agent/STANDARDS.md](.agent/STANDARDS.md) | **ALL** |
| **Proj Standards** | [.workspace/STANDARDS.md](.workspace/STANDARDS.md) | **ALL** |
| **State** | `.workspace/state/SCRATCHPAD.md` | **ALL** |
| **MCP Config** | `~/.gemini/antigravity/mcp_config.json` | DevOps |

## 🧠 Shared Memory Protocol
1. **State**: Read/write `.workspace/state/SCRATCHPAD.md`. Update the `Active Conductor Track` field.
2. **Skills**: Check [SKILL_INDEX.md](.gemini/skills/SKILL_INDEX.md). Invoke with: *"I'm using [skill] to [purpose]."*
3. **Flow**: Orchestrator → Conductor track (`conductor:newTrack`) or Hot Path.
   - Brownfield: `assessment:framework` first. Greenfield: `brainstorming` first.
   - Plans always go to `.workspace/tracks/<id>/plan.md` + `test-plan.md`.
4. **Git**: DevOps owns branches/PRs.
5. **Log**: Append all decisions and completions to `.workspace/state/NOTEPAD.md`.

## 🚀 New Agent Boot Sequence

> [!IMPORTANT]
> Fresh agent on existing work? Read **exactly these 3 files** in order. Do NOT explore blindly.

| Step | File | Extract |
|:---|:---|:---|
| 1 | `.workspace/state/SESSION.md` | Current task, next steps, danger zones |
| 2 | `.workspace/state/SCRATCHPAD.md` | Shared state, handoff queue |
| 3 | `.workspace/state/memory.md` | Structured facts (project topology, decisions, progress) |
| 4 | `.workspace/tracks/<active-id>/plan.md` | Task list — resume from current item (warms file for post-compact reinjection) |

No SESSION.md? → `assessment:framework` (brownfield) or `brainstorming` (greenfield), then `conductor:newTrack`.

**Retirement signals** → see `.agent/STANDARDS.md §Agent Lifecycle & Retirement`. Any single signal → `session:handoff`.

> [!TIP]
> **Standards Checklist**: Also refer to `.workspace/STANDARDS.md` alongside `.agent/STANDARDS.md` for project-level preferences.

## 🚀 Iron Rules (read every session)
1. **Conductor-first**: `conductor:newTrack` for anything needing a plan.
2. **Parallel over serial**: worktrees for isolated tasks; claim files in SCRATCHPAD File Ownership.
3. **Self-correct**: errors → `retro`. Route lessons: project → `LESSONS.md`; universal → propose to user for `~/.gemini/GEMINI.md`.
4. **TDD always**: failing test before implementation code.
5. **Double-review plans**: Review 1 = complete? Review 2 = simpler approach?

---

## 🧠 Global Lessons
<!-- Universal lessons — maintained by retro skill with explicit user approval -->

### CLI Tool Workspace Resolution — 2026-02-27
- **Context**: CLI tools installed globally that act on local repos
- **Lesson**: `__file__` or relative paths fetch global files, not local ones
- **Action**: Propagate `PROJECT_DIR=$PWD` from bash; use `os.getcwd()` in Python

### Bash Anti-Patterns in AI Workflow Scripts — 2026-02-27
- **Context**: Workflow/skill markdown with bash file-reading commands
- **Lesson**: `cat` pollutes terminal buffers when `view_file`/`read_file` tools exist
- **Action**: Always use native agent file-reading tools; never `cat` in workflow scripts

---

## 🛠 Project-Level Coding Standards

1. **Repeatedly test and fix issues discovered autonomously until all are resolved.**
2. **Artifact Location Protocol:** Save all design, implementation, and test artifacts (e.g., `implementation_plan.md`, `tech_debt_report.md`) natively under `.workspace/artifacts/` or `.workspace/tracks/` as appropriate for the scope, avoiding the default antigravity agent directories.
