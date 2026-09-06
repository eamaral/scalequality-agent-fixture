# AI assistant policy

This repository is governed by ScaleQuality. AI coding assistants
(Claude, Copilot, Cursor, …) must follow these rules:

- Every AI-assisted change goes through a human-reviewed pull request.
  No direct pushes to protected branches.
- AI-generated code must ship with tests that meaningfully assert
  behaviour — not just execute lines.
- Changes to sensitive areas (auth, payments, infrastructure, secrets,
  database migrations) require explicit human approval.
- Keep changes small and reviewable.
