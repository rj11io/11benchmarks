# cv-redesign-bench

A clean PDF-to-two-page-CV benchmark. Every coding agent must independently
recover and improve the CV content from the same two reference PDFs, research
an appropriate contemporary CV direction, and implement a responsive web CV
whose print output is exactly two A4 pages.

This benchmark evaluates the whole chain: source extraction, inference
discipline, content editing, design research, design rationale, screen
execution, and print execution.

## Current benchmark status

The published `cycle-1` interim release judges 2 eligible runs from 35 finished
runs; 33 legacy routes remain excluded because route-matched exact A4 PDF
evidence was unavailable. One AI judge scored the cohort, and the campaign
remains open.

Accounting covers 46 transcript threads and 409,730,298 tokens. Matched
benchmark runs cost $132.29, the judge cost $2.87, and priced benchmark
operations cost $66.09, for a partial known total of $201.24. These are
API-equivalent estimates rather than subscription invoices; 2 threads remain
unpriced. See the [published report](benchmark/cycles/cycle-1/report/report.md)
and [canonical cost ledger](benchmark/costs/COSTS.md).

## Frozen inputs

- `ref/RJ_CV.pdf` — concise two-page source.
- `ref/RJ_CV_max.pdf` — extended six-page source.
- `PROMPT.md` — task template. The runner replaces `{{RUN_ID}}` and freezes a
  copy under `benchmark/prompts/` for each run.
- `benchmark/rubric.md` — judging criteria, frozen before any run.
- The existing dependencies and shared shadcn/ui component set.

The PDFs are deliberately not converted into shared Markdown. Extracting,
reconciling, prioritizing, and rewriting their information is part of the
benchmark.

## Per-run outputs

Each run owns `app/<run-id>/` and must contain:

| Artifact | Purpose |
| --- | --- |
| `research.md` | Current CV/design research with sources and conclusions |
| `content.md` | Extracted facts, reconciled content, edits, and uncertainties |
| `design.md` | Chosen direction, hierarchy, responsive plan, and print plan |
| `layout.tsx` | Route metadata and optional route-level framing |
| `page.tsx` | The rendered CV |
| Supporting files | Client components, CSS modules, and local assets |

## Benchmark lifecycle

1. Keep the baseline and `ref/` files unchanged.
2. Freeze `benchmark/rubric.md`.
3. Prepare one run with an entry in `benchmark/runs.json` and a frozen prompt.
4. Let the agent write only its assigned route.
5. Audit isolation, dependencies, source handling, build health, and output
   surfaces.
6. Capture desktop, mobile, and every print page using identical settings.
7. Judge the anonymized research, content, design, and rendered evidence.
8. Measure cost, review the complete artifact set, and only then publish.

## Local development

```bash
npm install
npm run dev
```

Available checks:

```bash
npm run lint
npm run typecheck
npm run build
```
