import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, CircleDashed } from "lucide-react"
import { notFound } from "next/navigation"

import { TerminalBlock } from "@/components/site/terminal-block"
import {
  formatDate,
  formatMaybe,
  formatPercent,
  formatTokens,
  formatUsd,
  getBenchmarks,
  getRepoMeta,
  getRun,
  humanizeKey,
} from "@/lib/bench"

export function generateStaticParams() {
  return getBenchmarks().flatMap((benchmark) =>
    benchmark.cycles.flatMap((cycle) =>
      cycle.runs.map((run) => ({ slug: benchmark.slug, cycleId: cycle.id, runId: run.id }))
    )
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; cycleId: string; runId: string }>
}): Promise<Metadata> {
  const { slug, cycleId, runId } = await params
  const result = getRun(slug, cycleId, runId)
  return result ? { title: `${result.run.id} · ${result.cycle.id}`, description: `Read-only reviewed run metadata for ${result.run.id}.` } : {}
}

export default async function RunPage({
  params,
}: {
  params: Promise<{ slug: string; cycleId: string; runId: string }>
}) {
  const { slug, cycleId, runId } = await params
  const result = getRun(slug, cycleId, runId)
  if (!result) notFound()
  const { benchmark, cycle, run } = result
  const meta = getRepoMeta()
  const score = cycle.scores.find((candidate) => candidate.id === run.id)
  const sourceUrl = `${meta.githubUrl}/tree/main/${benchmark.githubPath}`
  const reportUrl = `${meta.githubUrl}/blob/main/${benchmark.githubPath}/benchmark/cycles/${cycle.id}/report/report.md`

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      <nav className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground" aria-label="Breadcrumb"><Link href={`/benchmarks/${benchmark.slug}`} className="inline-flex items-center gap-1 hover:text-foreground"><ArrowLeft className="size-3" /> {benchmark.title}</Link><span>/</span><Link href={`/benchmarks/${benchmark.slug}/cycles/${cycle.id}`} className="hover:text-foreground">{cycle.id}</Link><span>/</span><span className="text-foreground">{run.id}</span></nav>
      <header className="mt-7 border-b border-border/60 pb-8"><div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"><span>read-only run detail</span><span>·</span><span>{run.status ?? "status unavailable"}</span><span>·</span><span>audit {run.auditStatus ?? "unavailable"}</span></div><div className="mt-3 flex flex-wrap items-end justify-between gap-5"><div><h1 className="font-mono text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">{run.id}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{run.provider ?? "Provider unavailable"} · {run.model ?? "Model unavailable"} · {run.harness ?? "Harness unavailable"} · {run.effort ?? "effort unavailable"}</p></div><div className="flex flex-wrap gap-2"><Link href={`/benchmarks/${benchmark.slug}/cycles/${cycle.id}`} className="inline-flex h-9 items-center rounded-md border border-border px-3.5 text-sm font-medium hover:bg-muted">Back to cycle</Link><a href={reportUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground">Cycle report <ArrowUpRight className="size-3.5" /></a></div></div></header>

      <section className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"><Metric label="Reviewed score" value={run.score == null ? "Unavailable" : `${run.score.toFixed(2)} / 10`} detail={run.rank == null ? "Rank unavailable" : `rank ${run.rank} of ${cycle.scores.length}`} /><Metric label="Tokens" value={formatTokens(run.tokens)} detail={`${formatTokens(run.tokenBreakdown.input)} input · ${formatTokens(run.tokenBreakdown.output)} output`} /><Metric label="Observed cost" value={formatUsd(run.costUsd)} detail={`${formatPercent(run.cacheHitRate)} cache hit`} /><Metric label="Wall time" value={run.wallTimeMinutes == null ? "Unavailable" : `${run.wallTimeMinutes.toFixed(1)} min`} detail={run.eligible == null ? "Eligibility unavailable" : run.eligible ? "eligible" : "excluded"} /></section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5"><Heading kicker="01 · quality" title="Dimension scores" /><div className="mt-5 space-y-3">{score && Object.keys(score.dimensions).length ? Object.entries(score.dimensions).map(([key, value]) => <div key={key}><div className="flex items-center justify-between gap-3 text-sm"><span>{humanizeKey(key)}</span><span className="font-mono tabular-nums">{value.toFixed(1)} / 10</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground/70" style={{ width: `${Math.min(value * 10, 100)}%` }} /></div></div>) : <Unavailable text="Per-dimension score data is unavailable in this reviewed record." />}</div><div className="mt-5 grid gap-2 border-t border-border pt-4 text-xs"><Info label="Aggregate rank" value={run.rank == null ? "Unavailable" : `${run.rank} of ${cycle.scores.length}`} /><Info label="Judge median rank" value={run.judgeRank == null ? "Unavailable" : String(run.judgeRank)} /><Info label="Disagreement" value={run.scoreDisagreement == null ? "Unavailable" : String(run.scoreDisagreement)} /></div></section>

        <section className="rounded-lg border border-border bg-card p-5"><Heading kicker="02 · tokens and cost" title="Observed usage classes" /><div className="mt-5 grid gap-3 sm:grid-cols-2"><ValueCard label="Total tokens" value={formatTokens(run.tokenBreakdown.total)} /><ValueCard label="Input" value={formatTokens(run.tokenBreakdown.input)} /><ValueCard label="Output" value={formatTokens(run.tokenBreakdown.output)} /><ValueCard label="Reasoning" value={formatTokens(run.tokenBreakdown.reasoning)} /><ValueCard label="Cached input read" value={formatTokens(run.tokenBreakdown.cachedInputRead)} /><ValueCard label="Input uncached" value={formatTokens(run.tokenBreakdown.inputUncached)} /></div><div className="mt-5 grid gap-2 border-t border-border pt-4 text-xs"><Info label="Total cost" value={formatUsd(run.costBreakdown.totalUsd)} /><Info label="Input cost" value={formatUsd(run.costBreakdown.inputUsd)} /><Info label="Output cost" value={formatUsd(run.costBreakdown.outputUsd)} /><Info label="Cache hit rate" value={formatPercent(run.costBreakdown.cacheHitRate)} /></div></section>

        <section className="rounded-lg border border-border bg-card p-5"><Heading kicker="03 · provenance" title="Configuration and timestamps" /><div className="mt-5 grid gap-2 text-xs"><Info label="Provider" value={run.provider ?? "Unavailable"} /><Info label="Model" value={run.model ?? "Unavailable"} /><Info label="Harness" value={run.harness ?? "Unavailable"} /><Info label="Harness version" value={run.harnessVersion ?? "Unavailable"} /><Info label="Effort" value={run.effort ?? "Unavailable"} /><Info label="Run reference" value={run.runRef ?? "Unavailable"} /><Info label="Started" value={formatDate(run.startedAt)} /><Info label="Finished" value={formatDate(run.finishedAt)} /></div></section>

        <section className="rounded-lg border border-border bg-card p-5"><Heading kicker="04 · audit" title="Compliance and evidence state" /><div className="mt-5 grid gap-3">{Object.keys(run.audit).length ? Object.entries(run.audit).map(([key, value]) => <div key={key} className="rounded-md border border-border/70 bg-muted/30 p-3"><p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">{humanizeKey(key)}</p><p className="mt-1 text-sm leading-6">{formatMaybe(value)}</p></div>) : <Unavailable text="Audit details are unavailable in this reviewed record." />}</div></section>
      </div>

      <section className="mt-6 rounded-lg border border-border bg-card p-5"><Heading kicker="05 · metadata" title="Preserved reviewed fields" /><div className="mt-5 grid gap-2 sm:grid-cols-2">{Object.entries(run.metadataCoverage).map(([key, value]) => <Info key={key} label={humanizeKey(key)} value={formatMaybe(value)} />)}</div>{Object.keys(run.metadata).length ? <details className="mt-5 border-t border-border pt-4"><summary className="cursor-pointer text-sm font-medium">Show run metadata object</summary><pre className="mt-3 overflow-x-auto rounded-md bg-muted p-4 font-mono text-xs leading-6 text-muted-foreground">{JSON.stringify(run.metadata, null, 2)}</pre></details> : null}</section>

      <section id="run-this-benchmark" className="mt-10 grid gap-4 border-t border-border/60 pt-8 lg:grid-cols-2"><div className="rounded-lg border border-border bg-card p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Reproduce</p><h2 className="mt-2 text-xl font-semibold tracking-tight">Run this benchmark</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">This page is read-only evidence for the selected run. Use the repository and exact cycle results to compare a local run.</p><TerminalBlock className="mt-4" lines={[`cd ${benchmark.githubPath}`, "npm install", "npm run build"]} /><div className="mt-4 flex flex-wrap gap-4 font-mono text-[10px] text-muted-foreground"><a href={sourceUrl} target="_blank" rel="noreferrer" className="hover:text-foreground hover:underline">GitHub repository</a><a href={reportUrl} target="_blank" rel="noreferrer" className="hover:text-foreground hover:underline">Exact cycle results</a></div></div><div className="rounded-lg border border-border bg-muted/30 p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Create</p><h2 className="mt-2 text-xl font-semibold tracking-tight">Run your own benchmark</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Create a new benchmark campaign with the benchmark plugin.</p><a href="https://ai.rj11.io/plugins/benchmarks" target="_blank" rel="noreferrer" className="mt-5 inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground">Open benchmark plugin <ArrowUpRight className="size-3.5" /></a></div></section>
    </div>
  )
}

function Heading({ kicker, title }: { kicker: string; title: string }) {
  return <div><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">{kicker}</p><h2 className="mt-2 text-xl font-semibold tracking-tight">{title}</h2></div>
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="bg-card px-4 py-4 sm:px-5"><p className="font-mono text-[10px] tracking-[0.13em] text-muted-foreground uppercase">{label}</p><p className="mt-2 text-lg font-semibold tabular-nums">{value}</p><p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{detail}</p></div>
}

function ValueCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md border border-border/70 bg-muted/30 p-3"><p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">{label}</p><p className="mt-2 text-sm font-semibold tabular-nums">{value}</p></div>
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 last:border-0"><span className="text-muted-foreground">{label}</span><span className="max-w-[65%] text-right font-mono">{value}</span></div>
}

function Unavailable({ text }: { text: string }) {
  return <div className="flex items-center gap-2 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground"><CircleDashed className="size-4" />{text}</div>
}
