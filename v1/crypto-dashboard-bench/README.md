# crypto-dashboard-bench

A clean end-to-end product benchmark. Every coding agent independently
researches crypto users, market structure, portfolio/on-chain workflows, and
trust requirements; chooses a defensible product wedge; creates
production- and GTM-ready documentation; and builds a high-fidelity frontend
demo.

Research, product thinking, design thinking, domain correctness, and execution
are all first-class judged outputs.

## Required outputs per run

Each run owns `app/<run-id>/`:

| Artifact | Purpose |
| --- | --- |
| `research.md` | Users, workflows, competitors, market/data, trust, compliance, and design research |
| `prd.md` | Product thesis, requirements, data model, metrics, GTM, and risks |
| `design.md` | IA, workflows, visualization system, responsive behavior, and accessibility |
| `layout.tsx` and `page.tsx` | The frontend product demo |
| Supporting files | Route-local components, data, state, CSS modules, and assets |

The final demo must be evaluable without wallets, credentials, paid APIs, or a
backend. Realistic seeded data and `localStorage` are allowed.

## Lifecycle

1. Freeze the rubric and baseline before any run.
2. Prepare a ledger entry and exact per-run prompt.
3. Run one agent at a time in a clean working tree.
4. Audit isolation, dependencies, documentation, render health, and required
   interactions.
5. Capture all written artifacts and common desktop/mobile evidence.
6. Judge anonymously, measure cost, consolidate, and only then publish.

No runs have been started.

## Local development

```bash
npm install
npm run dev
```

Checks:

```bash
npm run lint
npm run typecheck
npm run build
```
