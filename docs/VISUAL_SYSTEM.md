# 4TWENTY Visual System

## Preservation rule

Before any UI, layout, navigation, component, page, demo, or design-system change, inspect the existing 4TWENTY.DEV application and treat its current visual identity as authoritative. Do not redesign the overall theme.

Preserve color behavior, typography, spacing philosophy, borders, radii, shadows, navigation, buttons, cards, forms, icons, widths, motion, logo treatment, and overall personality. New work must look as though it has always belonged to the same company.

## Observed baseline

A read-only inspection of the current public-site repository on 2026-08-24 found:

- dark-first ink/slate surfaces, with a supported light theme;
- cyan as the restrained primary/action accent;
- high-contrast slate text and muted secondary copy;
- compact uppercase mono labels with deliberate tracking;
- tight, confident display typography;
- thin low-contrast borders, modest radii, and restrained shadows;
- dense, useful control surfaces rather than decorative dashboards;
- industrial language and slash-mark motifs such as `WORK//CTRL`;
- Lucide-style line icons and purposeful motion;
- responsive widths that favor readable, bounded content.

These observations document conventions; they do not copy the marketing repository or freeze exact token values. During implementation, derive approved tokens from an explicit, reviewed snapshot and record provenance.

## Non-negotiable constraints

Do not introduce a generic SaaS, agency, enterprise, or AI-startup aesthetic. Avoid unnecessary gradients, glassmorphism, oversized pills/cards, glowing AI effects, giant whitespace, decorative charts, unrelated fonts, random accent colors, or a second component library.

Demo businesses may vary in name, logo/avatar, terminology, data, and a limited supported accent. They do not receive unrelated visual systems.

## Component policy

Inspect and reuse existing primitives before creating new ones. Keep domain language outside generic visual primitives. Components must support keyboard use, visible focus, semantic markup, reduced motion, contrast, zoom, narrow screens, loading, empty, error, and permission-denied states.

## Change policy

Preserve an imperfect established pattern unless it blocks the requested feature, creates a clear accessibility/usability defect, or the user explicitly requests redesign. When change is necessary, make the smallest consistent change and document the reason. Visual refactors may consolidate code while preserving rendered appearance.

## Verification

Compare new pages against approved 4TWENTY reference pages at desktop and mobile widths. Ask: “Does this clearly look like the same company and product family?” Record screenshots and any intentional deviations. Completion reports must state whether existing global styles changed.

