# cyber-dashboard-bench

A clean end-to-end product benchmark. Every coding agent independently
researches the cybersecurity market and operator workflows, chooses and
defends a product thesis, writes production- and GTM-ready product/design
documentation, and builds a high-fidelity frontend demo from the same frozen
baseline.

The benchmark judges every stage, including whether the final interface
actually implements the decisions made in the research, PRD, and design
document.

## Current benchmark status

The published `cyber-dashboard-2026-07-17-v2` interim release includes 24
anonymously judged runs from 26 finished runs; 2 runs were excluded after
rendering-audit failures. One AI judge scored the cohort. A later `v3` cycle is
collecting evidence and is not yet published; the campaign remains open.

Accounting covers 48 transcript threads and 138,661,098 tokens. Matched
benchmark runs cost $94.82, the judge cost $3.80, and priced benchmark
operations cost $0.91, for a partial known total of $99.53. These are
API-equivalent estimates rather than subscription invoices; 17 threads remain
unpriced. See the [published report](benchmark/cycles/cyber-dashboard-2026-07-17-v2/report/report.md)
and [canonical cost ledger](benchmark/costs/COSTS.md).

## Required outputs per run

Each run owns `app/<run-id>/`:

| Artifact | Purpose |
| --- | --- |
| `research.md` | Market, user, workflow, competitor, security, and design research |
| `prd.md` | Product thesis, users, requirements, data model, metrics, GTM, and risks |
| `design.md` | Information architecture, workflows, visual system, data-viz, responsive, and accessibility plan |
| `layout.tsx` and `page.tsx` | The frontend product demo |
| Supporting files | Route-local components, state, CSS modules, and assets |

The demo is frontend-only. It should use credible seeded data and may use
`localStorage` for persistence. It must not require credentials, paid APIs, or
a backend to evaluate.

## Lifecycle

1. Freeze the rubric and baseline before any run.
2. Prepare one ledger entry and one exact prompt per run.
3. Run one agent at a time in a clean working tree.
4. Audit folder isolation, dependencies, documentation, rendering, and
   required interactions.
5. Capture the three written artifacts plus identical desktop and mobile
   product evidence.
6. Judge anonymized runs, measure cost, consolidate, and only then publish.

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
