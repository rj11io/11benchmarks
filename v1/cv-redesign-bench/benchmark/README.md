# Benchmark artifacts

This directory is operator-owned. Candidate agents must not edit it.

The published interim release is [`cycle-1`](cycles/cycle-1/report/report.md).
It contains 2 judged runs from 35 finished runs and one AI judge. Accounting
and the limitations of the cost estimates are documented in
[`costs/COSTS.md`](costs/COSTS.md).

| Path | Owner | Purpose |
| --- | --- | --- |
| `runs.json` | runner | Run ledger and prompt/reference hashes |
| `prompts/` | runner | Exact frozen prompt supplied to each run |
| `rubric.md` | rubric creator | Frozen quality definition |
| `audits/` | auditor | Mechanical eligibility verdicts |
| `screenshots/` | judge | Identical mobile, desktop, and print evidence |
| `judging/` | judge | Anonymous mapping and independent judge files |
| `results.json` | judge | Median-aggregated scores and ranking |
| `costs/` | accountant | Transcript-derived run and operations costs |
| `report/` | reviewer/reporter | Consolidated data and shareable report |

Before the first run, record the baseline commit, prompt SHA-256, reference
manifest SHA-256, and rubric SHA-256. All runs in one cohort must share those
values.
