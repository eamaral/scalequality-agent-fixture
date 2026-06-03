# CLAUDE.md — AI Usage Policy for `scalequality-agent-fixture`

This repository is a **fixture repo for ScaleQuality Agents end-to-end testing (Fase 2)** and **intentionally contains quality gaps**. That makes AI-assistant discipline *more* important here, not less: agents must not silently "fix" or hide the deliberate gaps, and every change must remain traceable so we can measure agent behavior end-to-end.

This policy is binding for **all AI coding assistants** (Claude, GitHub Copilot, Cursor, Windsurf, and any other LLM-backed tooling) **and all human contributors**.

---

## 1. Stack (ground truth)

- **Language:** TypeScript `^5.4.0`
- **Build:** `npm run build` → `tsc`
- **Tests:** `npm test` → `jest` (via `ts-jest`, `@types/jest`)
- **Package manager:** npm (`package.json`, version `0.1.0`)

Do not introduce new languages, runtimes, or frameworks (no switching to Vitest, Mocha, Bun, Deno, etc.) without explicit human approval in the PR.

---

## 2. Allowed AI assistants & how to use them

**Allowed:** Claude, GitHub Copilot, Cursor, Windsurf.

**Allowed uses:**
- Drafting/refactoring TypeScript under `src/` and test files.
- Writing or extending Jest tests.
- Explaining code, suggesting types, improving `tsconfig`/build config (with review).

**Not allowed:**
- Auto-applying changes directly to any protected branch (`main`) — agents work only via branches/PRs.
- "Silently repairing" the intentional quality gaps that exist for fixture testing. If an agent identifies a gap, it must **describe it in the PR**, not erase the test signal without sign-off.
- Bulk autonomous commits with no human in the loop (no unattended agent runs that push to remote without review).
- Pasting repo contents into any external model/tool not covered by the org's approved-tool list and data boundary (see §6).

---

## 3. Human review is mandatory

**Every AI-assisted change ships via a human-reviewed pull request. No exceptions.**

- No direct pushes to `main`.
- At least **one human reviewer** must approve before merge.
- The human reviewer is accountable for the merged code — "the AI wrote it" is never a justification.
- Reviewer must confirm the change does not accidentally remove or mask intended fixture gaps.

---

## 4. Tests are required

This repo's test runner is **Jest** (`npm test`).

- Every AI-assisted change to logic in `src/` **must ship with meaningful Jest tests** — not placeholder/`expect(true)` tests.
- Tests must actually exercise the changed behavior (real inputs, edge cases, failure paths).
- Run before opening a PR:
  ```
  npm test
  npm run build
  ```
- `npm run build` (`tsc`) must pass with no new type errors.
- Do **not** weaken or delete existing tests to make a build green. If a test is intentionally failing as part of the fixture design, flag it in the PR rather than deleting it.

---

## 5. Sensitive areas — explicit sign-off required

This is a small fixture repo, so most "sensitive domains" (auth, payments, customer PII, production IaC) are **not expected to exist** here. Do not fabricate or scaffold them.

If a change touches any of the following, it requires **explicit human sign-off in the PR** (named approver, not just an LGTM):

- **Build & type config:** `tsconfig.json`, `jest.config.*`, `package.json` (`scripts`, `dependencies`, `devDependencies`).
- **Test harness / fixtures:** any files that define the intentional quality gaps or the expected ScaleQuality Agent test outcomes.
- **CI / automation config** if added (e.g. `.github/workflows/`).
- **Any introduction of secrets handling, network calls, auth, or data persistence** — if an agent proposes adding these, treat it as a sensitive change and require sign-off plus a justification.

When in doubt, escalate rather than assume the area is low-risk.

---

## 6. Data & privacy boundaries

- **Never** send secrets, credentials, API tokens, or `.env` contents to any external model or assistant.
- **Never** paste real customer data — this fixture should contain only synthetic/test data; keep it that way.
- Do not commit secrets. There are no production credentials expected in this repo; if any appear, treat as an incident and rotate.
- Respect the org's approved-tool list and data-residency boundaries. If your assistant routes code to a third-party service not covered by that boundary, do not use it on this repo.
- Generated `node_modules/`, build output, and local config must not be committed unless intentional.

---

## 7. Traceability — AI-assisted changes must be attributable

So adoption stays measurable (this repo exists to test agents end-to-end):

- **Commit trailer** on AI-assisted commits:
  ```
  Assisted-by: <tool> (e.g. Claude / Copilot / Cursor / Windsurf)
  ```
- **PR description** must state:
  - Which assistant(s) were used and for what.
  - What the human reviewer verified (tests run, build passed, gaps reviewed).
- Keep AI-assisted PRs **small and focused** — one logical change per PR — so behavior is easy to audit and attribute.

---

## 8. Secure-by-default & dependency hygiene

- Prefer the **standard library and existing deps**. Do not add npm dependencies casually.
- Any new dependency requires: justification in the PR, a check that it's maintained, and human approval (it falls under §5 — touches `package.json`).
- Pin/respect existing version ranges; do not bump TypeScript, Jest, or ts-jest majors without sign-off.
- No `eval`, no dynamic `require` of untrusted input, no disabling type checks (`// @ts-ignore`, `any` floods) just to pass `tsc`.
- Validate and type inputs at boundaries; do not introduce unsafe casts to silence the compiler.

---

## 9. Quick checklist (before opening a PR)

- [ ] Change made on a branch, not `main`.
- [ ] `npm test` passes (or intended-failures are documented, not deleted).
- [ ] `npm run build` (`tsc`) passes with no new errors.
- [ ] Meaningful Jest tests added/updated for the change.
- [ ] No secrets, credentials, or real customer data added or transmitted.
- [ ] Intentional fixture quality-gaps preserved unless removal is explicitly approved.
- [ ] `Assisted-by:` trailer present; PR notes which assistant was used and what the human verified.
- [ ] Sensitive-area changes (§5) carry a named human sign-off.

---

**Team guidance, when provided, is authoritative and overrides the generic defaults above.** If a rule here conflicts with explicit instructions from the repo owners (@eamaral / ScaleQuality Agents team), follow theirs and update this file.
