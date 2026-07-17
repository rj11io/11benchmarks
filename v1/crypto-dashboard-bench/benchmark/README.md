# Benchmark artifacts

This directory is operator-owned and read-only for candidate agents.

The published interim release is [`cycle-1`](cycles/cycle-1/report/report.md).
It contains 16 judged runs from 26 finished runs and one AI judge. Accounting
and the limitations of the cost estimates are documented in
[`costs/COSTS.md`](costs/COSTS.md).

The lifecycle uses:

- `runs.json` for the ledger and frozen-input hashes;
- `prompts/` for exact per-run prompts;
- `rubric.md` for the precommitted quality definition;
- `audits/` for mechanical eligibility;
- `screenshots/` and `judging/` for common evidence and independent scores;
- `results.json` for aggregated rankings;
- `costs/` for transcript-derived spend;
- `report/` for reviewed canonical data and publication artifacts.

The audit must verify that `research.md`, `prd.md`, and `design.md` exist before
the run can reach judging.
