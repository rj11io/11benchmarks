<!--
  Benchmark operator: replace every {{RUN_ID}} with the assigned run id,
  save the exact result under benchmark/prompts/{{RUN_ID}}.md, hash it,
  and give that frozen copy to the agent.
-->

# Task: research, rewrite, and redesign my CV

You are one of several coding agents receiving this exact task in the same
repository. Each agent works independently from the same PDF references and
the same application baseline. The results are compared across the complete
process: source extraction, inference discipline, content improvement, design
research, design rationale, responsive execution, and print execution.

Your folder: `app/{{RUN_ID}}`

## Objective

Build a polished one-route CV website at `/{{RUN_ID}}` and a print version
that fits **exactly two A4 pages**.

This is a redesign, not a transcription exercise. Recover the candidate's
professional history from both PDFs in `ref/`, reconcile their differences,
decide what deserves space, improve the writing without inventing facts, and
choose a design direction supported by current research.

## Required process artifacts

Create all of these inside your folder before finishing:

### `research.md`

Document current research into:

- effective CV/resume structure for a senior AI product/frontend engineer;
- recruiter and hiring-manager scanning behavior;
- contemporary editorial, typographic, information-design, and print
  directions suitable for this profile;
- ATS, accessibility, link, and PDF considerations.

Include source titles, URLs, access dates, concise findings, and the decisions
those findings changed. Prefer authoritative or expert primary sources. Do not
copy another candidate implementation. If web research is unavailable, state
that limitation instead of fabricating sources.

### `content.md`

Create the canonical content model you will render. It must:

- distinguish directly extracted facts from editorial inference or rewriting;
- reconcile conflicts and duplication between `RJ_CV.pdf` and
  `RJ_CV_max.pdf`;
- record omissions and compression choices required by the two-page limit;
- flag uncertainties instead of silently resolving them;
- preserve factual names, employers, dates, links, and claims;
- improve clarity, impact, and prioritization without inventing metrics or
  achievements.

The website must render from this file or from a structured file derived from
it inside your run folder. Do not hardcode a separate, divergent copy.

### `design.md`

Explain the chosen visual direction, hierarchy, typography, grid, responsive
behavior, accessibility choices, and exact two-page print strategy. Connect
the design decisions to `research.md` and the content constraints.

## Implementation

- Create `app/{{RUN_ID}}/layout.tsx` and `app/{{RUN_ID}}/page.tsx`.
- Add a visible **Download PDF** control that calls `window.print()`.
- You may add components, CSS modules, structured data, and local assets
  inside your folder.
- Render all important contact links and professional sections justified by
  your content strategy.
- The screen version must work at mobile width (~375 px) and desktop width
  (~1440 px).
- Print must be readable black-on-white even when the screen is in dark mode.
- The print result must be exactly two A4 pages with deliberate page breaks,
  no clipped content, no blank third page, and no screen-only controls.

## Hard rules

1. Write only inside `app/{{RUN_ID}}/`.
2. Treat `ref/` as immutable source evidence. Do not modify, replace, or
   annotate the PDFs.
3. Do not modify `benchmark/`, `components/ui/`, `lib/`, `hooks/`,
   `app/globals.css`, the root `app/layout.tsx`, package files, or lockfiles.
4. Do not install dependencies.
5. Do not inspect or borrow from any other run folder.
6. Use Tailwind and/or CSS modules scoped to your folder. Do not import
   route-level global CSS.
7. Do not invent facts, dates, employers, credentials, metrics, or links.
8. Work autonomously and finish the complete chain.

## Done means

- `research.md`, `content.md`, and `design.md` are complete and mutually
  consistent.
- The route renders without console errors.
- `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- The content shown by the implementation comes from the run's canonical
  content artifact.
- The desktop and mobile layouts are deliberate and free of horizontal
  overflow.
- Links work and remain legible in print.
- Browser print preview produces exactly two clean A4 pages.
