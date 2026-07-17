import fs from "node:fs"
import path from "node:path"
import { ArrowUpRight, FileText } from "lucide-react"

const Github = ({ className }: { className?: string }) => (
  <span className={className}>GH</span>
)

const suite = {
  title: "cyber-dashboard-bench",
  objective:
    "Benchmark end-to-end cybersecurity product research, definition, design, and frontend execution.",
  artifacts: ["research.md", "prd.md", "design.md"],
}
type Data = Record<string, unknown>
const record = (value: unknown): Data =>
  value && typeof value === "object" ? (value as Data) : {}
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])
const text = (value: unknown, fallback = "—") =>
  typeof value === "string" && value ? value : fallback
const number = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null
function loadReview() {
  const dir = path.join(process.cwd(), "benchmark", "cycles")
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).flatMap((id) => {
        const file = path.join(dir, id, "review", "data.json")
        if (!fs.existsSync(file)) return []
        try {
          return [
            { id, data: JSON.parse(fs.readFileSync(file, "utf8")) as Data },
          ]
        } catch {
          return []
        }
      })
    : []
  return (
    files.sort(
      (a, b) =>
        (number(record(b.data.cycle).publicationSequence) ?? 0) -
        (number(record(a.data.cycle).publicationSequence) ?? 0)
    )[0] ?? { id: "unpublished", data: {} }
  )
}
function runs(review: Data) {
  const app = path.join(process.cwd(), "app")
  const reviewed = new Map(
    list(review.runs).map((value) => {
      const run = record(value)
      return [text(run.id, text(run.runId, "")), run]
    })
  )
  return fs
    .readdirSync(app, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith("_") &&
        fs.existsSync(path.join(app, entry.name, "page.tsx"))
    )
    .map((entry) => {
      const run = record(reviewed.get(entry.name))
      return {
        id: entry.name,
        status: text(run.status, "registered"),
        score: number(record(run.score).total),
        artifacts: suite.artifacts.filter((artifact) =>
          fs.existsSync(path.join(app, entry.name, artifact))
        ),
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}
export default function Page() {
  const { id, data } = loadReview()
  const review = record(data)
  const lifecycle = record(review.lifecycle)
  const metadata = record(review.metadataCoverage)
  const cycle = record(review.cycle)
  const accounting = record(review.accounting)
  const total = record(accounting.total)
  const rows = runs(review)
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <header className="border-b border-border/60 pb-8">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-xs text-muted-foreground">
              11bench / clean suite
            </p>
            <a
              href="https://github.com/rj11io/11bench/tree/main/v1/cyber-dashboard-bench"
              target="_blank"
              rel="noreferrer"
              aria-label="Open benchmark on GitHub"
              className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Github className="size-4" />
            </a>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                {text(lifecycle.campaignStatus)} · {text(cycle.releaseType)}{" "}
                release
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                {suite.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                {text(record(review.benchmark).objective, suite.objective)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                Latest reviewed cycle
              </p>
              <p className="mt-3 font-mono text-lg">{id}</p>
              <a
                href={`https://github.com/rj11io/11bench/blob/main/v1/cyber-dashboard-bench/benchmark/cycles/${id}/report/report.md`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              >
                Open report <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </header>
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
          <Metric
            label="Registered runs"
            value={String(number(lifecycle.totalRuns) ?? rows.length)}
          />
          <Metric
            label="Eligible / judged"
            value={String(
              number(lifecycle.eligibleRuns) ?? metadata.eligibleRunCount ?? "—"
            )}
          />
          <Metric
            label="Accounted tokens"
            value={
              total.tokens
                ? `${(Number(total.tokens) / 1_000_000).toFixed(1)}M`
                : "—"
            }
          />
          <Metric
            label="Total cost"
            value={
              typeof total.costUsd === "number"
                ? `$${total.costUsd.toFixed(2)}`
                : "partial / unavailable"
            }
          />
        </section>
        <section className="grid gap-4 py-10 sm:grid-cols-3">
          {suite.artifacts.map((artifact, index) => (
            <div
              key={artifact}
              className="rounded-lg border border-border bg-card p-5"
            >
              <FileText className="size-4 text-muted-foreground" />
              <p className="mt-4 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                0{index + 1}
              </p>
              <h2 className="mt-2 font-medium">{artifact}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                A required process artifact that stays available alongside the
                rendered product route.
              </p>
            </div>
          ))}
        </section>
        <section className="border-t border-border/60 pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                Run registry
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Every registered route
              </h2>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {rows.length} routes
            </span>
          </div>
          <div className="mt-5 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  <th className="px-3 py-2.5">Run</th>
                  <th className="px-3 py-2.5">State</th>
                  <th className="px-3 py-2.5 text-right">Score</th>
                  <th className="px-3 py-2.5">Artifacts</th>
                  <th className="px-3 py-2.5 text-right">Open</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((run) => (
                  <tr
                    key={run.id}
                    className="border-b border-border/70 last:border-0"
                  >
                    <td className="px-3 py-2.5 font-mono text-xs">{run.id}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {run.status}
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                      {run.score?.toFixed(2) ?? "—"}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {suite.artifacts.map((artifact) => (
                          <span
                            key={artifact}
                            className={`rounded border px-2 py-1 font-mono text-[10px] ${run.artifacts.includes(artifact) ? "border-border bg-muted" : "border-dashed border-border text-muted-foreground"}`}
                          >
                            {run.artifacts.includes(artifact) ? "✓ " : "○ "}
                            {artifact}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <a
                        href={`/${run.id}`}
                        className="inline-flex items-center gap-1 font-medium hover:underline"
                      >
                        Open <ArrowUpRight className="size-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="mt-10 rounded-lg border border-border bg-muted/30 p-5">
          <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
            Review coverage
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Tokens: {text(metadata.tokenCounts, "unavailable")} · pricing:{" "}
            {text(metadata.pricing, "unavailable")} · evidence and audits remain
            tied to the canonical cycle artifact.
          </p>
        </section>
        <footer className="mt-10 flex flex-wrap gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          <a
            href="https://github.com/rj11io/11bench/tree/main/v1/cyber-dashboard-bench"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground hover:underline"
          >
            Run it yourself <ArrowUpRight className="inline size-3" />
          </a>
          <a
            href="https://ai.rj11.io/plugins/benchmarks"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground hover:underline"
          >
            Run your own <ArrowUpRight className="inline size-3" />
          </a>
        </footer>
      </div>
    </main>
  )
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-4 py-4 sm:px-5">
      <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  )
}
