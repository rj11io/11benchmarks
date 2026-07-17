import Link from "next/link"
import { ArrowUpRight, CheckCircle2, FileText, Layers3 } from "lucide-react"

import { formatTokens, formatUsd, getBenchmark } from "@/lib/benchmark"

const Github = ({ className }: { className?: string }) => (
  <span className={className}>GH</span>
)

export default function Page() {
  const benchmark = getBenchmark()
  const latest = benchmark.latest
  const judge = benchmark.judges
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <header className="border-b border-border/60 py-8 sm:py-12">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="https://bench.rj11.io"
              className="font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              11bench / benchmark explorer
            </Link>
            <a
              href="https://github.com/rj11io/11bench/tree/main/v1/gh-readme-bench"
              target="_blank"
              rel="noreferrer"
              aria-label="Open source on GitHub"
              className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Github className="size-4" />
            </a>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                {benchmark.campaign} · interim release
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                GitHub README benchmark
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                {benchmark.objective}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {benchmark.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                Published source
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                This site reads the reviewed cycle artifact and keeps
                unavailable fields explicit.
              </p>
              <Link
                href={latest ? `/cycles/${latest.id}` : "#"}
                className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground"
              >
                Explore latest cycle <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
          <Metric
            label="Registered runs"
            value={benchmark.runCount.toString()}
          />
          <Metric
            label="Eligible / judged"
            value={benchmark.eligibleCount?.toString() ?? "—"}
          />
          <Metric
            label="Accounted tokens"
            value={formatTokens(benchmark.tokens)}
          />
          <Metric
            label="Matched run cost"
            value={formatUsd(benchmark.matchedCost)}
          />
        </section>

        <section className="grid gap-4 py-10 sm:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "Source fidelity",
              body: "Two frozen CV PDFs become research, extracted content, and a GitHub-compatible README.",
            },
            {
              icon: Layers3,
              title: "Reviewed history",
              body: `${benchmark.cycles.length} reviewed cycle${benchmark.cycles.length === 1 ? "" : "s"} remain addressable as the campaign stays open.`,
            },
            {
              icon: CheckCircle2,
              title: "Judge context",
              body: `${String(judge.total ?? "—")} judge${judge.total === 1 ? "" : "s"} · ${String(judge.ai ?? "—")} AI · ${String(judge.human ?? "—")} human. Identity-blinded where reported.`,
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-card p-5"
            >
              <Icon className="size-4 text-muted-foreground" />
              <h2 className="mt-4 font-medium">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </section>

        <section className="border-t border-border/60 py-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                Cycle history
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Reviewed releases
              </h2>
            </div>
            <a
              href="https://github.com/rj11io/11bench/tree/main/v1/gh-readme-bench/benchmark"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              View source artifacts <ArrowUpRight className="inline size-3" />
            </a>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {benchmark.cycles.map((cycle) => (
              <Link
                key={cycle.id}
                href={`/cycles/${cycle.id}`}
                className="group rounded-lg border border-border bg-card p-5 hover:border-foreground/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm">{cycle.id}</span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {cycle.runIds.length} registered run routes ·{" "}
                  {cycle.releaseType} · {cycle.status}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {benchmark.surfaces.slice(0, 3).map((surface) => (
                    <span
                      key={surface}
                      className="rounded border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground"
                    >
                      {surface}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border/60 py-10">
          <div className="rounded-lg border border-border bg-muted/30 p-6">
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              Calls to action
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              Reproduce the benchmark or create the next one.
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="https://github.com/rj11io/11bench/tree/main/v1/gh-readme-bench"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3.5 text-sm font-medium hover:bg-muted"
              >
                Run it yourself <ArrowUpRight className="size-3.5" />
              </a>
              <a
                href="https://ai.rj11.io/plugins/benchmarks"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground"
              >
                Run your own <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </section>
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
