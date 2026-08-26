# Yorkstead Operations

The unified industrial operations platform built by Yorkstead for custom manufacturing, fabrication, and field service workflows.

## Core Capabilities Implemented (Prompts 00 - 26)

- **Phase 00: Foundation & Workflow Audit Engine**
  - Architecture Decision Records (`docs/adr/ADR-0001` through `ADR-0004`)
  - Authoritative Design System & Dark/Light Tokens (`docs/VISUAL_SYSTEM.md`)
  - Real-Time Diagnostic Scoring Engine & Printable Executive Audit (`/audit`)
- **Phase 10: Core Platform**
  - Organizations, Tenancy Boundaries, & Active Org Switcher (`/settings/organization`)
  - Least-Privilege Capability-Based RBAC Matrix (`/settings/roles`)
  - Private Files, Expiring Signed URLs, Operational Activity Trail, & Outbox (`/files`, `/activity`)
  - Master Data for Customers, Vendors, and Locations (`/directory`)
  - Canonical Jobs Aggregate & Workflow State Engine (`/jobs`)
  - Versioned Tenant Configuration & Dynamic Module Registry (`/settings/configuration`, `/modules`)
- **Phase 20: Operations Modules**
  - Mobile Shopfloor Terminal & Digital Traveler QR Routing (`/shopfloor`)
  - Barcode-First Inventory Ledger & Overdraft Policy Guardrails (`/inventory`)
  - Job Packet Intelligence & Critical Revision Inconsistency Alerts (`/job-packets`)
  - Quality Assurance, FAI Inspection Checklists, & NCR Containment (`/quality`)
  - Machine Registers, Downtime Intervals, PM Schedules, & Return-To-Service (`/maintenance`)
  - Packaging Units, Gross Weight Limits, & Palletization Manifests (`/packaging`)
  - Shipping Load Builder, Sequenced Route Stops, Digital BOL, & Proof of Delivery (`/shipping`)

## Toolchain & Verification

- **Runtime & Package Manager**: `bun` (v1.3.14)
- **Framework**: `Next.js 16.3.2` with Turbopack & React 19
- **Typecheck**: `bun run typecheck`
- **Lint**: `bun run lint`
- **Unit & Integration Tests**: `bun test` (15 test suites, 45 tests)
- **Database Migrations**: `bun run db:migrate:check`
- **Production Build**: `bun run build`

## Architecture & Visual System

- See `docs/ARCHITECTURE.md` for tenant isolation, domain aggregate boundaries, and service design rules.
- See `docs/VISUAL_SYSTEM.md` for authoritative design tokens and UI components.
