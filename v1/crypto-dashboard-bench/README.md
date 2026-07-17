# crypto-dashboard-bench

A clean end-to-end product benchmark. Every coding agent independently
researches crypto users, market structure, portfolio/on-chain workflows, and
trust requirements; chooses a defensible product wedge; creates
production- and GTM-ready documentation; and builds a high-fidelity frontend
demo.

Research, product thinking, design thinking, domain correctness, and execution
are all first-class judged outputs.

## Current benchmark status

The published `cycle-1` interim release includes 16 anonymously judged runs
from 26 finished runs; 10 runs were excluded after route/build failures. One AI
judge scored the cohort, and the campaign remains open.

Accounting covers 48 transcript threads and 153,076,710 tokens. Matched
benchmark runs cost $102.20, the judge cost $3.23, and priced benchmark
operations cost $1.37, for a partial known total of $106.81. These are
API-equivalent estimates rather than subscription invoices; 17 threads remain
unpriced. See the [published report](benchmark/cycles/cycle-1/report/report.md)
and [canonical cost ledger](benchmark/costs/COSTS.md).

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

Cycle 1 is published as an interim result: 26 ledger runs were audited, 16
eligible runs were judged anonymously, and 10 runs were retained as excluded
after route/build failures. The campaign remains open for later runs or a
final cycle.

Canonical outputs are under `benchmark/cycles/cycle-1/`, including the reviewed
data, report, anonymized evidence, judge artifact, aggregate, and current
pointer. Transcript token counts and API-equivalent pricing are reconciled under
`benchmark/costs/`; some synthetic operations remain unpriced.

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
