# 4TWENTY Operations

4TWENTY Operations is the commercial operational-software platform behind configurable customer implementations and safe interactive demos. It is intentionally separate from [4TWENTY.DEV](https://www.4twenty.dev), the public marketing and portfolio site.

## Product principle

Build the software an operation actually needs and leave out what it does not. Each role should see the smallest useful interface for completing its work.

## Repository status

This repository begins as a documentation-first scaffold. There is no speculative application code or dependency manifest yet. Prompt `00-foundation/02-platform-foundation.md` selects and records the implementation baseline before dependencies are installed.

## Structure

- `app/`: application routes and composition
- `modules/`: bounded business modules in a modular monolith
- `components/`: shared presentation primitives only
- `db/`: schema, migrations, seeds, and database utilities
- `demo/`: isolated scenarios, fixtures, reset policies, and safety controls
- `lib/`: cross-cutting technical utilities
- `scripts/`: repeatable development and operational scripts
- `tests/`: cross-module, integration, accessibility, and end-to-end tests
- `docs/`: durable architecture and operating decisions
- `prompts/`: ordered Gemini execution plan

## Start here

1. Read `AGENTS.md`.
2. Read `docs/VISUAL_SYSTEM.md`.
3. Read `prompts/PROMPTS_README.md`.
4. Run prompts one at a time and stop at every checkpoint.
5. Require a clean working tree and recorded verification before advancing.

## Repository relationship

`4twenty.dev` owns public positioning, lead capture, and portfolio entry pages. `4twenty-ops` owns authenticated operations, demo organizations, customer configurations, and business modules. They may share documented brand conventions and stable links, but never a database, authentication boundary, deployment environment, or copied implementation by default.

