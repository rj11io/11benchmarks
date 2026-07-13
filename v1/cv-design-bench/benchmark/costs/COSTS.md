# Token & cost review — cv-design-bench (2026-07-13)

Measured from harness session transcripts on this machine (Codex:
`~/.codex/sessions`, cumulative totals, last event per session; Claude
Code: `~/.claude/projects`, per-message usage deduped by message id
across resumed sessions). Rates verified 2026-07-13 against the official
pricing pages (OpenAI: developers.openai.com/api/docs/pricing; Anthropic:
platform.claude.com/docs/en/pricing) and embedded in each JSON file next
to this one. Dollar figures are API-equivalent values — subscription
plans may bill differently.

Print this data anytime with the token-accountant skill's
`scripts/print-costs.sh` from the repo root.

## Measured benchmark runs ($5.46)

| Run | Model | Total input | Cache hit | Output | Wall time | Cost |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| codex-gpt5.6-sol-high | gpt-5.6-sol | 2.07M | 92.4% | 18.4k | 8.9 min | $2.29 |
| claude-fable5-high | claude-fable-5 | 721k | 93.7% read | 8.9k | 3.5 min | $1.66 |
| codex-gpt5.6-terra-high | gpt-5.6-terra | 1.52M | 83.6% | 10.9k | 4.6 min | $1.11 |
| codex-gpt5.6luna-high | gpt-5.6-luna | 1.52M | 89.0% | 16.4k | 6.2 min | $0.40 |

## Other measured sessions ($9.22)

- **cross-run-review** — four Sol sessions at 11:55 referencing all
  three gpt-5.6 run folders: **$7.21**, more than all measured builds
  combined.
- **repo-conversations** — two Fable 5 sessions from 2026-07-09 working
  on the repo's content (review/critique), not builds: **$2.02**.
  Notably cache-inefficient (39% hit rate vs 84–94% for the builds) —
  long gaps between turns let the 5-minute prompt cache expire.

Measured total: **$14.68** / 13.3M tokens.

## Unmeasured runs (7)

`claude-haiku4.5`, `claude-opus4.8-high`, `claude-sonnet5-high`,
`codex-gpt5.4-high`, `codex-gpt5.4mini-high`, `codex-gpt5.5-high`,
`codex-gpt5.6-sol-ultra-fast` — no session transcripts exist on this
machine (both harness session stores searched, all dates). They were
likely run on another machine or a cloud harness. To record them, paste
each harness's own reported totals and they'll be added as
`method: "reported"`.

## Observations

- **Fable 5 built the CV in 3.5 minutes for $1.66** using only ~721k
  total input tokens — a third of what any Codex run read — but its
  higher per-token price ($10/$50 vs $1–5 input) keeps it mid-pack on
  cost.
- **Luna remains the value pick**: $0.40, with output volume close to
  Sol's.
- **Cache pricing dominates every bill**: builds ran 84–94% cached.
  Priced naively at full input rates, the measured total would look like
  ~$60 instead of $14.68.
