# scalequality-agent-fixture

Fixture repo for ScaleQuality Agents (Fase 2 end-to-end).
Intentional gaps: no SCA config (dependabot), no tests/coverage.

<!-- scalequality:onboarding:start -->
<!-- Maintained by the ScaleQuality documentation agent. Edit freely: the agent replaces only what is between these markers. -->

## Getting started

This is a Node.js project written in TypeScript, using npm for dependency management. An npm lockfile is present, so use npm to keep installs reproducible.

Install dependencies:

```bash
npm install
```

Build the project (runs `tsc`):

```bash
npm run build
```

Run the tests (runs jest):

```bash
npm run test
```

The repository does not pin a Node.js version.

## Configuration

No environment variables are read by the code, and there is no `.env` example in the repository. There is nothing to configure to run the project.

## Repository layout

- `src/` - TypeScript source files (5 files).

<!-- scalequality:onboarding:end -->
