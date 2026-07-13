# cv-design-bench

A benchmark for how different coding agents design the same thing: a
personal CV website with a "Download PDF" button (browser print dialog).
Every run gets identical content, identical components, and identical
rules — the only variable is the model's taste.

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

## Starting a run

1. Fill in (or update) the content in `content/*.md`.
2. Copy `PROMPT.md`, replace every `{{RUN_ID}}` with the run's folder
   name (e.g. `codex-gpt5.5-high`).
3. Give it to the agent in this repo. When it finishes, the run appears
   at `/codex-gpt5.5-high` and on the home page.

## Judging

Compare runs at three sizes: mobile (~375px), desktop, and the print
preview ("Download PDF" must produce a clean black-on-white document).
Content edits are the regression test — adding an entry to
`content/experience.md` must show up in every run with no code changes.

---

Built on the Next.js + shadcn/ui template. To add more shadcn components
to the shared baseline: `npx shadcn@latest add <component>` (they land in
`components/ui/`, which benchmark runs must not edit).
