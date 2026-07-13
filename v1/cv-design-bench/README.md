# cv-design-bench

A benchmark for how different coding agents design the same thing: a
personal CV website with a "Download PDF" button (browser print dialog).
Every run gets identical content, identical components, and identical
rules — the only variable is the model's taste.

## Status

**11 runs complete** across two harnesses (July 2026): Claude Code
(fable5, opus4.8, sonnet5, haiku4.5) and Codex (gpt-5.4, 5.4-mini, 5.5,
5.6 sol / sol-ultra-fast / terra / luna). Cost accounting is done —
see `benchmark/costs/COSTS.md`. Judging has not run yet.

Total spend on runs: **$39.82** (API-equivalent), spanning 30× between
the cheapest (gpt-5.6-luna, $0.40) and most expensive (claude-fable-5,
$12.22) build of the same task.

## How it works

- **`content/*.md`** — the CV data, one file per section. Single source
  of truth; every run renders from it. Format documented in
  `content/README.md`.
- **`lib/cv/`** — shared typed loader (`loadCV()`) and inline-markdown
  renderer, so runs compete on design, not on markdown parsing.
- **`PROMPT.md`** — the task given to every agent, with the rules baked
  in: stay in your folder, no new dependencies, don't edit the shadcn
  components, style through classes only.
- **`app/{harness}-{model}-{effort}/`** — one folder per run, e.g.
  `app/codex-gpt5.5-high`. Each run owns its `layout.tsx` and `page.tsx`
  there. The home page at `/` auto-lists all runs.
- **`benchmark/costs/`** — measured token/cost data: one JSON per run
  (token counts by model, cache breakdown, rates used, and the evidence
  that the thread really was the run), `summary.json`, and the readable
  `COSTS.md`.

## Starting a run

1. Fill in (or update) the content in `content/*.md`.
2. Copy `PROMPT.md`, replace every `{{RUN_ID}}` with the run's folder
   name (e.g. `codex-gpt5.5-high`).
3. Give it to the agent in this repo. When it finishes, the run appears
   at `/codex-gpt5.5-high` and on the home page.

## Cost accounting

Costs are measured from the harness's own session transcripts and priced
with web-verified per-model rates (cache reads/writes priced correctly —
runs here were 84–98% cached, so naive full-rate math overstates cost
~3–4×). A thread only counts as a run if it started from the frozen
prompt AND wrote files into that run's folder; everything else is
bucketed as repo conversation.

The measured data lives in `benchmark/costs/`: one JSON per run with
token counts, cache breakdown, the rates used, and the attribution
evidence, plus `summary.json` and the readable `COSTS.md`.

## Judging

Compare runs at three sizes: mobile (~375px), desktop, and the print
preview ("Download PDF" must produce a clean black-on-white document).
Content edits are the regression test — adding an entry to
`content/experience.md` must show up in every run with no code changes.
Once judging results exist in `benchmark/results.json`, they can be
joined with the cost data for cost per rubric point.

---

Built on the Next.js + shadcn/ui template. To add more shadcn components
to the shared baseline: `npx shadcn@latest add <component>` (they land in
`components/ui/`, which benchmark runs must not edit).
