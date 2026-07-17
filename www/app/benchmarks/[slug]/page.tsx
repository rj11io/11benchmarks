import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
} from "lucide-react"
import { notFound } from "next/navigation"

import { GitHubIcon } from "@/components/site/github-icon"
import { RunTable } from "@/components/site/run-table"
import {
  formatTokens,
  formatUsd,
  getBenchmark,
  getBenchmarks,
  getRepoMeta,
} from "@/lib/bench"

export function generateStaticParams() {
  return getBenchmarks().map((benchmark) => ({ slug: benchmark.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const benchmark = getBenchmark((await params).slug)
  return benchmark
    ? { title: benchmark.title, description: benchmark.objective }
    : {}
}

export default async function BenchmarkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const benchmark = getBenchmark((await params).slug)
  if (!benchmark) notFound()
  const meta = getRepoMeta()
  const latest = benchmark.latestCycle
  const reportUrl = latest
    ? `${meta.githubUrl}/blob/main/${benchmark.githubPath}/benchmark/cycles/${latest.id}/report/report.md`
    : null
  const sourceUrl = `${meta.githubUrl}/tree/main/${benchmark.githubPath}`

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav
        className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-3" /> 11bench
        </Link>
        <span>/</span>
        <span className="text-foreground">{benchmark.slug}</span>
      </nav>

      <header className="mt-8 grid gap-8 border-b border-border/60 pb-8 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            {benchmark.campaignStatus ?? "status unavailable"} · benchmark
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
            {benchmark.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            {benchmark.objective}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {benchmark.skillTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3.5 text-sm font-medium hover:bg-muted"
          >
            <GitHubIcon className="size-4" /> Source
          </a>
          {reportUrl ? (
            <a
              href={reportUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground"
            >
              Open report <ArrowUpRight className="size-3.5" />
            </a>
          ) : null}
        </div>
      </header>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        <Metric label="Registered runs" value={benchmark.runCount.toString()} />
        <Metric
          label="Eligible / judged"
          value={benchmark.eligibleRunCount?.toString() ?? "—"}
        />
        <Metric
          label="Accounted tokens"
          value={formatTokens(benchmark.totalTokens)}
        />
        <Metric
          label="Matched run cost"
          value={formatUsd(benchmark.knownRunCostUsd)}
        />
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0">
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                  Latest reviewed state
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  {latest?.id ?? "No reviewed cycle"}
                </h2>
              </div>
              {latest?.releaseType ? (
                <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground uppercase">
                  {latest.releaseType}
                </span>
              ) : null}
            </div>
            {latest ? (
              <>
                <div className="mt-5 rounded-lg border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                        Judging composition
                      </p>
                      <p className="mt-2 text-sm font-medium">
                        {benchmark.judgeCounts.total} judge
                        {benchmark.judgeCounts.total === 1 ? "" : "s"} ·{" "}
                        {benchmark.judgeCounts.ai} AI ·{" "}
                        {benchmark.judgeCounts.human} human
                      </p>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {latest.status ?? "status unavailable"}
                    </p>
                  </div>
                  {latest.scores.length ? (
                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full min-w-[520px] text-sm">
                        <thead>
                          <tr className="border-b border-border text-left font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                            <th className="pr-3 pb-2">Rank</th>
                            <th className="pr-3 pb-2">Candidate</th>
                            <th className="pb-2 text-right">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {latest.scores.slice(0, 8).map((score) => (
                            <tr
                              key={`${score.id}-${score.rank}`}
                              className="border-b border-border/60 last:border-0"
                            >
                              <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                                {score.rank ?? "—"}
                              </td>
                              <td className="py-2 pr-3 font-mono text-xs">
                                {score.id}
                              </td>
                              <td className="py-2 text-right font-semibold tabular-nums">
                                {score.total?.toFixed(2) ?? "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <MissingState label="Scores unavailable in this reviewed cycle." />
                  )}
                </div>
                <div className="mt-8">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight">
                        Read-only run catalog
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Run metadata is surfaced from the reviewed artifact and
                        is never edited by this site.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {latest.runs.length} records
                    </span>
                  </div>
                  <div className="mt-4">
                    <RunTable runs={latest.runs} />
                  </div>
                </div>
              </>
            ) : (
              <MissingState label="No published review data is available yet." />
            )}
          </section>
        </main>

        <aside className="space-y-4">
          <section className="rounded-lg border border-border bg-card p-5">
            <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              Evidence surfaces
            </p>
            <div className="mt-4 space-y-2">
              {(benchmark.evidenceSurfaces.length
                ? benchmark.evidenceSurfaces
                : ["unavailable"]
              ).map((surface) => (
                <div key={surface} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="size-4 text-muted-foreground" />
                  {surface}
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              Metadata coverage
            </p>
            <div className="mt-4 space-y-2">
              {Object.entries(benchmark.metadataCoverage)
                .slice(0, 8)
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 text-xs last:border-0"
                  >
                    <span className="text-muted-foreground">{key}</span>
                    <span className="text-right font-mono">
                      {String(value)}
                    </span>
                  </div>
                ))}
            </div>
          </section>
          <section className="rounded-lg border border-border bg-muted/30 p-5">
            <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              Accounting note
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Known run cost is shown separately from total accounting. Unpriced
              threads and unidentified work remain visible in the source review.
            </p>
          </section>
        </aside>
      </div>

      <section className="mt-12 border-t border-border/60 pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              History
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              Published cycles
            </h2>
          </div>
          <Link
            href="/"
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            Back to catalog
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {benchmark.cycles.map((cycle) => (
            <div key={cycle.id} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm">{cycle.id}</span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">
                  {cycle.releaseType ?? "—"}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {cycle.runCount} reviewed run records ·{" "}
                {cycle.status ?? "status unavailable"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
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
function MissingState({ label }: { label: string }) {
  return (
    <div className="mt-5 flex items-center gap-2 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
      <CircleDashed className="size-4" />
      {label}
    </div>
  )
}
