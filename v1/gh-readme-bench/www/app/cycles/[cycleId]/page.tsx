import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, CircleDashed } from "lucide-react"
import { notFound } from "next/navigation"

import {
  formatTokens,
  formatUsd,
  getCycle,
  getCycles,
  valueOf,
} from "@/lib/benchmark"

export function generateStaticParams() {
  return getCycles().map((cycle) => ({ cycleId: cycle.id }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ cycleId: string }>
}): Promise<Metadata> {
  const cycle = getCycle((await params).cycleId)
  return cycle ? { title: cycle.id } : {}
}

export default async function CyclePage({
  params,
}: {
  params: Promise<{ cycleId: string }>
}) {
  const cycle = getCycle((await params).cycleId)
  if (!cycle) notFound()
  const accounting = (valueOf(cycle.review, "accounting") ?? {}) as Record<
    string,
    unknown
  >
  const total = (accounting.total ?? {}) as Record<string, unknown>
  const reportUrl = `https://github.com/rj11io/11bench/blob/main/v1/gh-readme-bench/benchmark/cycles/${cycle.id}/report/report.md`
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <nav className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <ArrowLeft className="size-3" /> gh-readme-bench
          </Link>
          <span>/</span>
          <span className="text-foreground">{cycle.id}</span>
        </nav>
        <header className="mt-8 flex flex-col gap-5 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              {cycle.releaseType} · {cycle.status}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              {cycle.id}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              A read-only snapshot of registered routes, reviewed metadata,
              accounting coverage, and published judge output.
            </p>
          </div>
          <a
            href={reportUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3.5 text-sm font-medium hover:bg-muted"
          >
            Open report <ArrowUpRight className="size-3.5" />
          </a>
        </header>
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
          <Metric
            label="Registered routes"
            value={cycle.runIds.length.toString()}
          />
          <Metric
            label="Reviewed records"
            value={cycle.runs.length.toString()}
          />
          <Metric
            label="Accounted tokens"
            value={formatTokens(
              typeof total.tokens === "number" ? total.tokens : null
            )}
          />
          <Metric
            label="Known cost"
            value={formatUsd(
              typeof total.costUsd === "number" ? total.costUsd : null
            )}
          />
        </section>
        <section className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                  Run registry
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  All read-only records
                </h2>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {cycle.runs.length} rows
              </span>
            </div>
            <div className="mt-5 overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                    <th className="px-3 py-2.5">Run</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Audit</th>
                    <th className="px-3 py-2.5 text-right">Tokens</th>
                    <th className="px-3 py-2.5 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {cycle.runs.map((run) => (
                    <tr
                      key={run.id}
                      className="border-b border-border/70 last:border-0"
                    >
                      <td className="px-3 py-2.5 font-mono text-xs">
                        {run.id}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {run.status}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {run.audit}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs">
                        {formatTokens(run.tokens)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs">
                        {formatUsd(run.cost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <aside className="space-y-4">
            <section className="rounded-lg border border-border bg-card p-5">
              <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                Judge output
              </p>
              {cycle.scores.length ? (
                <div className="mt-4 space-y-2">
                  {cycle.scores.slice(0, 8).map((score) => (
                    <div
                      key={`${score.id}-${score.rank}`}
                      className="flex justify-between gap-3 text-sm"
                    >
                      <span className="font-mono text-xs">{score.id}</span>
                      <span className="font-semibold tabular-nums">
                        {score.total?.toFixed(2) ?? "—"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 flex gap-2 text-sm text-muted-foreground">
                  <CircleDashed className="size-4 shrink-0" />
                  Scores unavailable in this reviewed cycle.
                </div>
              )}
            </section>
            <section className="rounded-lg border border-border bg-muted/30 p-5">
              <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                Pricing coverage
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {String(
                  (accounting.pricing as Record<string, unknown> | undefined)
                    ?.pricing ?? "Unavailable"
                )}
                . Total cost remains separate from the matched run rows.
              </p>
            </section>
          </aside>
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
