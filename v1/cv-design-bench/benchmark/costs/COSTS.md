# Token & cost review — cv-design-bench (complete, 2026-07-13)

All 11 benchmark runs measured from harness session transcripts,
including runs recovered from the repo's previous name (`rj11-cv` —
both harnesses key session storage by working directory, so the July 7
runs lived under the old path).

**Every attribution was verified two ways** before counting: the thread's
kickoff must be the frozen benchmark prompt ("# Task: build my personal
CV website"), and the thread must actually write files into its run's
`app/<run-id>/` folder. Threads that only *mention* run folders (content
reviews, "i asked..." chats) are grouped under `repo-conversations` and
kept out of run costs. This chat thread itself (session `e8e5417a`) is
excluded entirely. Two earlier attributions were corrected by this
check: the July 13 "fable5" sessions were chat, not the build (the real
fable5 build is July 7), and the 11:55 four-session cluster was the
`sol-ultra-fast` run (26 file writes into its folder), not a review.

Rates verified 2026-07-13 against official pricing pages and embedded in
each JSON file. `claude-sonnet5-high` is priced at Sonnet 5 intro rates
($2/$10 per MTok, in effect through 2026-08-31; standard would be 1.5×).
Dollar figures are API-equivalent values.

## Benchmark runs — all 11 measured ($39.82)

| Run | Ran | Cache hit | Wall | Cost |
| --- | --- | ---: | ---: | ---: |
| claude-fable5-high | Jul 7 | 97% | 24.1 min | $12.22 |
| codex-gpt5.6-sol-ultra-fast | Jul 13 | 93% | 24.3 min | $7.21 |
| claude-opus4.8-high | Jul 7 | 96% | 16.5 min | $4.87 |
| claude-sonnet5-high | Jul 7 | 98% | 22.3 min | $4.51 |
| codex-gpt5.5-high | Jul 7 | 91% | 10.0 min | $2.99 |
| codex-gpt5.4-high | Jul 7 | 94% | 14.4 min | $2.99 |
| codex-gpt5.6-sol-high | Jul 13 | 92% | 8.5 min | $2.29 |
| codex-gpt5.6-terra-high | Jul 13 | 84% | 4.4 min | $1.11 |
| claude-haiku4.5 | Jul 7 | 98% | 8.9 min | $0.66 |
| codex-gpt5.4mini-high | Jul 13 | 88% | 14.3 min | $0.58 |
| codex-gpt5.6luna-high | Jul 13 | 89% | 6.0 min | $0.40 |

Runs total: **$39.82**. Non-run work (`repo-conversations`: content
reviews and follow-up chats across both repo names, deduped): **$5.69**.
Grand total: **$45.51**.

## Observations

- **Fable 5 is the outlier at $12.22** — 3× the median run. Its 24-minute
  session read heavily at $10/MTok input; whether the design justifies it
  is a question for judging, and cost-per-rubric-point will answer it.
- **The extremes span 30×**: Luna ($0.40) to Fable ($12.22) for the same
  task. Haiku and gpt-5.4-mini both landed under $0.70.
- **sol-ultra-fast cost 3.1× plain sol-high** ($7.21 vs $2.29) for the
  same model — the parallel-session pattern (1 main + 3 helpers) re-read
  the repo four times.
- **Claude runs cache harder than Codex runs** (96–98% vs 84–94%),
  reflecting Claude Code's aggressive prompt-cache breakpoints; that's
  what keeps Opus 4.8 at $4.87 despite reading the most expensive way.
- Naive full-rate pricing would put the total near $150 — cache-aware
  math is the difference between a right and wrong benchmark cost.

Print anytime: `print-costs.sh` from the token-accountant skill.
