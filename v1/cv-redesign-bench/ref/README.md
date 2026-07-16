# Frozen reference PDFs

These PDFs are the only shared content inputs for the benchmark:

- `RJ_CV.pdf` — concise two-page A4 CV.
- `RJ_CV_max.pdf` — extended six-page A4 CV.

Agents must independently extract and reconcile their content. Do not add a
shared transcript or normalized content file; extraction quality is part of
the task.

The operator-pinned hashes and page counts are recorded in
`benchmark/reference-manifest.json`. Any change to either PDF creates a new
benchmark cohort.
