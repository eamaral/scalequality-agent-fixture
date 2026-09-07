# scalequality-agent-fixture

Fixture repo for ScaleQuality Agents (Fase 2 end-to-end).
Intentional gaps: no SCA config (dependabot), no tests/coverage.

## Configuration

This application reads its credentials from environment variables. Copy `.env.example` to `.env` and fill in the values locally; set the same variables wherever the application runs (your hosting provider's environment settings).

- `API_SECRET`: required. Used in src/config.ts.
