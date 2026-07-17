# 11bench website

The current Next.js website for 11bench, deployed at
[bench.rj11.io](https://bench.rj11.io/).

The site presents the benchmark catalog and per-benchmark pages. At build time
it scans `v1/*/README.md` files, excludes internal directories such as
`_app-boilerplate_`, and reads measured run summaries from each
`benchmark/costs/summary.json`. The pages show benchmark descriptions, measured
run counts, token totals, and run cost summaries; detailed judging and partial
cost accounting remains in each benchmark's repository artifacts.

The four current benchmark pages are `crypto-dashboard-bench`,
`cv-redesign-bench`, `cyber-dashboard-bench`, and `gh-readme-bench`.

## Local development

This app requires Node.js and npm. It does not currently use environment
variables.

```bash
npm install
npm run dev
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript without emitting files |
| `npm run format` | Format TypeScript and TSX files with Prettier |

## Add UI components

The shadcn/ui configuration writes components to `components/ui/` and uses
aliases such as `@/components` and `@/lib`.

```bash
npx shadcn@latest add <component>
```
