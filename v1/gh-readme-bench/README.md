# GitHub README benchmark

A benchmark for AI-generated GitHub profile READMEs. Every agent independently
extracts and reconciles the same two CV PDFs, researches current high-quality
profile README patterns and creative conventions, then produces a truthful,
captivating, GitHub-compatible profile.

Extraction, research, editorial judgment, information design, creative flair,
technical compatibility, and the final rendered README are all judged.

## Frozen inputs

- `ref/RJ_CV.pdf` — concise two-page source.
- `ref/RJ_CV_max.pdf` — extended six-page source.
- `PROMPT.md` — run template with a `{{RUN_ID}}` token.
- `benchmark/rubric.md` — quality criteria frozen before any run.

There is no shared transcript or Markdown content pack. PDF extraction and
inference are part of the benchmark.

## Per-run outputs

Each run owns `runs/<run-id>/`:

| Artifact | Purpose |
| --- | --- |
| `research.md` | GitHub profile, content, creative, accessibility, and compatibility research |
| `content.md` | Extracted facts, editorial choices, and uncertainty log |
| `README.md` | Final GitHub profile README |
| `assets/` | Optional local SVG/raster assets used by the README |

## Lifecycle

1. Freeze prompt, rubric, PDFs, and baseline commit.
2. Register the run in `benchmark/runs.json` and save its exact prompt.
3. Let the agent write only inside `runs/<run-id>/`.
4. Audit source fidelity, citations, isolation, links, and GitHub rendering.
5. Render every README with the same GitHub-compatible renderer at common
   desktop and narrow widths.
6. Judge anonymized process artifacts and final renders.
7. Measure cost, review the artifact set, and only then publish.

No runs have been started.
