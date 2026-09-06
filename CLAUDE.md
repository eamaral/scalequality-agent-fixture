# CLAUDE.md — AI Usage & Engineering Governance Policy

**Repository:** `eamaral/scalequality-agent-fixture`
**Stack:** TypeScript (compiled via `tsc`), tested with Jest (`ts-jest`), npm.
**Purpose of repo:** Fixture for ScaleQuality Agents end-to-end testing (Fase 2). It **intentionally contains quality gaps** — treat existing code as a known-imperfect baseline, not as a reference to imitate.

This file is authoritative for **both AI coding assistants and human contributors**. If you use an AI assistant here, you are still fully accountable for the output as if you wrote it by hand.

---

## 1. Scope & intent

Because this repo is a test fixture for the ScaleQuality Agents pipeline, changes are frequently authored or triggered by automated agents. That makes disciplined AI governance essential: agent-generated changes must be **traceable, tested, and human-reviewed** so the fixture stays a reliable signal for the pipeline being validated.

Do **not** "fix" the intentional quality gaps unless a task explicitly asks for it — silently patching them can invalidate end-to-end test scenarios. If in doubt, ask in the PR.

---

## 2. Allowed AI assistants & how to use them

**Allowed:**
- **Claude** (Anthropic) — code, tests, refactors, docs.
- **GitHub Copilot** — inline completion and chat.
- **Cursor / Windsurf** — editor-integrated assistance.
- **ScaleQuality Agents** — the primary automated contributor this fixture exists to exercise.

**How they may be used:**
- Generating TypeScript source under `src/` and Jest specs.
- Writing/refactoring build config (`tsconfig.json`) and test config (`jest.config.*`).
- Drafting documentation and PR descriptions.

**Not allowed:**
- Any assistant that transmits repo contents to a model or endpoint **not approved by the org's data boundary** (see §6).
- Auto-merge, force-push to protected branches, or bypassing PR review — no matter which agent produced the change.
- Fully autonomous commits directly to `main`. Everything lands via PR (§3).

---

## 3. Human review is mandatory

**Every AI-assisted change ships as a human-reviewed pull request. No exceptions.**

- No direct pushes to `main`.
- At least **one human approver** who is not the change author must review and approve — this applies even when the author is an agent.
- The human reviewer is accountable for correctness, security, and test quality of the merged code.
- Large agent-generated PRs should be split into reviewable units; do not rubber-stamp bulk diffs.

---

## 4. Tests are required

This repo uses **Jest + ts-jest**. AI-assisted changes must ship with **meaningful tests**, not placeholder assertions.

**Commands (must pass before merge):**
```
npm test        # jest
npm run build   # tsc — must compile cleanly
```

**Rules:**
- New logic → new/updated `*.test.ts` or `*.spec.ts` covering the actual behavior and edge cases.
- Tests must assert real outcomes; `expect(true).toBe(true)` and snapshot-only tests for logic are rejected.
- If a change touches an intentional quality gap, tests must document the expected fixture behavior explicitly.
- Do not delete or weaken existing tests to make a change pass. If a test genuinely must change, justify it in the PR.
- The `build` step must stay green — no committing code that fails `tsc`.

---

## 5. Sensitive areas requiring explicit sign-off

This is a small fixture repo, so the sensitive surface is narrower than a production service — but the following still require **explicit human sign-off** and a note in the PR:

- **Build & type config:** `tsconfig.json`, `jest.config.*`, and `package.json` `scripts`/`build` — these define how the whole pipeline compiles and tests. Changes affect every downstream agent run.
- **Dependency changes:** any edit to `dependencies` / `devDependencies` in `package.json` or to `package-lock.json` (see §7).
- **CI / automation config:** any files under `.github/` (workflows, actions) — these control what the agents can do in CI.
- **Fixture "quality gap" definitions:** the intentional gaps that ScaleQuality Agents are meant to detect. Altering them changes test outcomes — flag and get sign-off.

If future paths appear that handle auth, secrets, migrations, or external API contracts, treat them as sensitive by default and require sign-off.

---

## 6. Data & privacy — hard boundaries

- **Never** send secrets, credentials, API tokens, or customer/production data to an external model or assistant. This repo is a fixture and should contain **no real secrets** — if you find one, remove it and rotate immediately.
- Do not paste `.env` files, private keys, or org-internal data into any AI prompt.
- Only use AI assistants configured to respect the org's approved data boundary. If you cannot confirm an assistant honors that boundary, do not use it on this repo.
- Keep the repo free of any data that shouldn't leave the org — even for a test fixture.

---

## 7. Dependency hygiene & secure-by-default

- Introduce a new npm dependency only when justified in the PR description. Prefer the existing toolchain (TypeScript, Jest, ts-jest).
- Pin versions consistently and commit the updated `package-lock.json`.
- Do not add packages that widen the attack surface (postinstall scripts, network access) without sign-off.
- Keep `strict` TypeScript settings; do not disable type checks or add `// @ts-ignore` to silence real errors introduced by AI-generated code.
- No hardcoded secrets, tokens, or endpoints in source — use configuration/env even in fixture code.

---

## 8. Traceability — AI changes must be attributable

So AI adoption stays **measurable, not ad-hoc**, every AI-assisted change must be identifiable:

- **Commit trailer** on AI-assisted commits:
  ```
  Assisted-by: <tool> (e.g. Claude, Copilot, Cursor, ScaleQuality-Agent)
  ```
- **PR label:** apply `ai-assisted` to any PR containing AI-generated code.
- **PR description** must state: which assistant was used, what it generated, and what the human reviewer verified.
- Agent-authored PRs must clearly identify the originating agent run so results can be traced back to the ScaleQuality pipeline.

---

## 9. Contributor checklist (AI or human)

Before requesting merge, confirm:

- [ ] `npm test` passes.
- [ ] `npm run build` (`tsc`) compiles cleanly.
- [ ] New/changed logic has meaningful Jest tests.
- [ ] No secrets or private data added or sent to any model.
- [ ] Sensitive files (§5) — sign-off obtained if touched.
- [ ] Intentional quality gaps left intact unless the task explicitly targets them.
- [ ] Dependency changes justified; lockfile committed.
- [ ] Commit `Assisted-by:` trailer and `ai-assisted` PR label applied where relevant.
- [ ] Opened as a PR with a human reviewer assigned.

---

**When unsure, ask in the PR rather than guessing.** A blocked PR is cheaper than a broken fixture or a leaked secret.
