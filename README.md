# scalequality-agent-fixture

Fixture repo for ScaleQuality Agents (Fase 2 end-to-end).
Intentional gaps: no SCA config (dependabot), no tests/coverage.

<!-- scalequality:onboarding:start -->
<!-- Maintained by the ScaleQuality documentation agent. Edit freely: the agent replaces only what is between these markers. -->

## Getting started

This is a Node.js project written in TypeScript, using npm for dependency management. The repository does not pin a Node version.

Install dependencies (an npm lockfile is present):

```bash
npm install
```

Build the project. This runs `tsc`:

```bash
npm run build
```

A `test` script exists in `package.json` and is wired to run jest:

```bash
npm run test
```

Note that the repository has no tests yet. Running the command will not execute any test cases until test files are added.

## Repository layout

- `src/` - TypeScript source files (5 files).

<!-- scalequality:onboarding:end -->
