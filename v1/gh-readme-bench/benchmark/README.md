# Benchmark artifacts

This directory is operator-owned and read-only for candidate agents.

| Path | Purpose |
| --- | --- |
| `runs.json` | Run ledger with baseline, prompt, reference, and rubric hashes |
| `prompts/` | Exact prompt supplied to each run |
| `rubric.md` | Frozen quality definition |
| `audits/` | Source, isolation, link, and render compliance |
| `screenshots/` | Common wide and narrow GitHub-compatible renders |
| `judging/` | Anonymous mapping and independent judge outputs |
| `results.json` | Aggregated scores and ranking |
| `costs/` | Transcript-derived costs |
| `report/` | Reviewed canonical data and final report |

All runs in one cohort must share the same prompt template, PDF hashes, rubric
hash, and evaluation renderer/version.
