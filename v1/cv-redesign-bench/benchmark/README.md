# Benchmark artifacts

This directory is operator-owned. Candidate agents must not edit it.

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
