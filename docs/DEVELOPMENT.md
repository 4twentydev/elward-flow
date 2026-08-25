# Development

## Current bootstrap state

No package manager, framework, or dependencies are installed in this scaffold. The Platform Foundation prompt must inspect the current ecosystem, propose the minimum supported stack, record it in an ADR, and only then create metadata and lockfiles.

## Expected workflow

Use a supported Windows toolchain, documented exact versions, and reproducible commands. Prefer Bun if the selected framework and deployment path are verified compatible. Provide scripts for development, formatting, linting, typechecking, unit tests, integration tests, end-to-end tests, build, migration checks, and security audit.

Use `.env.local` for local secrets and keep it ignored. Update `.env.example` with names, purpose, required/optional status, and safe placeholders only.

Before each prompt: pull/inspect, confirm clean scope, read relevant docs. Before commit: run the established checks individually, exercise the actual path, inspect the diff, and update docs.

