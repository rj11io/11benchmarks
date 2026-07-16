<!--
  Benchmark operator: replace every {{RUN_ID}} with the assigned run id,
  save the exact result under benchmark/prompts/{{RUN_ID}}.md, hash it,
  and give that frozen copy to the agent.
-->

# Task: research and create a captivating GitHub profile README

You are one of several coding agents receiving this exact task and the same
two PDF references. The comparison covers source extraction, inference
discipline, research quality, editorial judgment, GitHub-native information
design, creative execution, technical compatibility, and the final rendered
profile.

Your folder: `runs/{{RUN_ID}}`

## Objective

Independently recover the person's relevant story, experience, projects, and
skills from both PDFs in `ref/`. Research what makes an excellent contemporary
GitHub profile README, including creative patterns currently popular on
GitHub, then create an original profile README that feels personal,
technically credible, and memorable.

This is not a CV pasted into Markdown. Select, reorganize, and express the
content for the context of a developer's GitHub profile without inventing
facts.

## Required process artifacts

### `research.md`

Research:

- what strong GitHub profile READMEs communicate and how people scan them;
- current examples and conventions for developer/AI-engineer profiles;
- tasteful uses of badges, stats, cards, diagrams, animation, custom SVG,
  HTML, code blocks, and interactive-looking presentation;
- GitHub-flavored Markdown and HTML limitations;
- accessibility, mobile/narrow rendering, load reliability, privacy, and
  maintainability;
- failure modes such as badge walls, vanity metrics, broken dynamic services,
  excessive animation, generic AI copy, or visual noise.

Include source titles, URLs, access dates, findings, and the decisions each
finding changed. Prefer GitHub documentation and inspect real examples
critically. Never fabricate sources or popularity claims.

### `content.md`

Build the canonical editorial source for the README:

- distinguish facts extracted from the PDFs from inference and rewriting;
- reconcile differences and duplication between the concise and extended CV;
- select the material appropriate for a GitHub visitor;
- document omitted material and why;
- flag uncertainty rather than silently guessing;
- preserve accurate names, dates, employers, project names, and links;
- establish the intended voice, opening hook, and calls to action.

The final README must be derived from this artifact, not from a separate
contradictory version of the person's story.

### `README.md`

Create the final GitHub profile README using GitHub-compatible Markdown/HTML.
Optional assets must live under `runs/{{RUN_ID}}/assets/`.

The README should:

- create a strong opening and clear personal identity;
- prioritize current AI/product/open-source work while preserving useful
  credibility from the career history;
- make projects and contact paths easy to understand;
- use creative flair because it serves the narrative, not simply because a
  widget exists;
- remain understandable when external images or dynamic cards fail;
- avoid tracking pixels, credential requirements, misleading stats, invented
  activity, and inaccessible color-only meaning;
- render cleanly at both normal GitHub width and a narrow/mobile width.

## Hard rules

1. Write only inside `runs/{{RUN_ID}}/`.
2. Do not modify `ref/`, `benchmark/`, the benchmark README, or other runs.
3. Do not inspect or copy another run.
4. Do not invent biographical facts, achievements, metrics, projects, links,
   research citations, or GitHub activity.
5. Do not depend on private credentials or services the evaluator cannot
   access.
6. Work autonomously and complete extraction, research, editorial design, and
   final execution.

## Done means

- `research.md`, `content.md`, and `README.md` are complete and consistent.
- Every material claim in the profile is supported by the PDFs or explicitly
  framed as editorial voice rather than fact.
- All local asset paths resolve and external links use valid URLs.
- The README uses valid GitHub-flavored Markdown/allowed HTML.
- It remains coherent without dynamic third-party images.
- Wide and narrow rendered previews are legible, structured, and free of
  accidental overflow.
