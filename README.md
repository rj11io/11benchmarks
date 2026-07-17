# 11bench

AI benchmark experiments for comparing how coding agents solve the same
product and design tasks.

The current website is deployed at [bench.rj11.io](https://bench.rj11.io/).

## Repository layout

| Path | Purpose |
| --- | --- |
| [`www/`](www/) | Current Next.js website for 11bench |
| [`v1/cv-redesign-bench/`](v1/cv-redesign-bench/) | Clean PDF-to-two-page-CV research, extraction, content, and design benchmark |
| [`v1/cyber-dashboard-bench/`](v1/cyber-dashboard-bench/) | Clean end-to-end cybersecurity product research, PRD, design, and frontend benchmark |
| [`v1/crypto-dashboard-bench/`](v1/crypto-dashboard-bench/) | Clean end-to-end crypto product research, PRD, design, and frontend benchmark |
| [`v1/gh-readme-bench/`](v1/gh-readme-bench/) | Clean PDF-to-GitHub-profile research, extraction, editorial, and creative benchmark |
| [`v1/_app-boilerplate_/`](v1/_app-boilerplate_/) | Reusable Next.js and shadcn/ui starter for v1 benchmarks |

The four benchmark suites use frozen inputs and rubrics, operator-owned
artifact directories, and interim releases that remain open for later runs.
Their detailed reports distinguish eligible, excluded, and unpublished work.

## Benchmark status and costs

The table below summarizes the latest published interim release for each suite.
Costs are transcript-derived API-equivalent estimates, not subscription
invoices. “Partial known total” includes matched runs, the judge, and priced
benchmark operations; threads without a verified provider price remain
unpriced.

| Benchmark | Latest published release | Judged / finished | Judge | Matched runs | Judge cost | Partial known total |
| --- | --- | ---: | --- | ---: | ---: | ---: |
| [`crypto-dashboard-bench`](v1/crypto-dashboard-bench/) | [`cycle-1`](v1/crypto-dashboard-bench/benchmark/cycles/cycle-1/report/report.md) · interim | 16 / 26 | 1 AI | $102.20 | $3.23 | $106.81 |
| [`cv-redesign-bench`](v1/cv-redesign-bench/) | [`cycle-1`](v1/cv-redesign-bench/benchmark/cycles/cycle-1/report/report.md) · interim | 2 / 35 | 1 AI | $132.29 | $2.87 | $201.24 |
| [`cyber-dashboard-bench`](v1/cyber-dashboard-bench/) | [`2026-07-17-v2`](v1/cyber-dashboard-bench/benchmark/cycles/cyber-dashboard-2026-07-17-v2/report/report.md) · interim | 24 / 26 | 1 AI | $94.82 | $3.80 | $99.53 |
| [`gh-readme-bench`](v1/gh-readme-bench/) | [`cycle-1`](v1/gh-readme-bench/benchmark/cycles/cycle-1/report/report.md) · interim | 26 / 26 | 1 AI | $49.82 | $3.21 | $53.40 |

Open each suite README for its accounting links, rubric, and current-cycle
caveats. The canonical detailed ledgers are [`crypto costs`](v1/crypto-dashboard-bench/benchmark/costs/COSTS.md), [`CV costs`](v1/cv-redesign-bench/benchmark/costs/COSTS.md), [`cyber costs`](v1/cyber-dashboard-bench/benchmark/costs/COSTS.md), and [`GitHub README costs`](v1/gh-readme-bench/benchmark/costs/COSTS.md).

## Run an app locally

Each app has its own `package.json` and lockfile; this repository is not an
npm workspace. Change into the app you want to run, then install and start it:

```bash
cd www
npm install
npm run dev
```

Use any Next.js benchmark directory or `v1/_app-boilerplate_` instead of
`www` to run that app. Their available scripts are the same:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript without emitting files |
| `npm run format` | Format TypeScript and TSX files with Prettier |

No environment variables are currently required by these apps.

## Releases

The root `package.json` contains only the semantic-release tooling. Pushes to
`main` run the release workflow, which derives releases from commit messages,
updates `CHANGELOG.md`, and publishes the GitHub release.
