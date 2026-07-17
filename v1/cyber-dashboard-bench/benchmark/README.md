# Benchmark artifacts

This directory is operator-owned and read-only for candidate agents.

The published interim release is [`2026-07-17-v2`](cycles/cyber-dashboard-2026-07-17-v2/report/report.md),
with 24 judged runs from 26 finished runs and one AI judge. A `v3` collection
cycle exists but is not yet published. Accounting and the limitations of the
cost estimates are documented in [`costs/COSTS.md`](costs/COSTS.md).

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
