import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { notFound } from "next/navigation"

import { QualityChart, CostQualityChart } from "@/components/site/quality-chart"
import { RunTable } from "@/components/site/run-table"
import { TerminalBlock } from "@/components/site/terminal-block"
import {
  formatDate,
  formatInteger,
  formatMaybe,
  formatTokens,
  formatUsd,
  getBenchmark,
  getBenchmarks,
  getCycle,
  getRepoMeta,
  humanizeKey,
} from "@/lib/bench"

export function generateStaticParams() {
  return getBenchmarks().flatMap((benchmark) =>
    benchmark.cycles.map((cycle) => ({ slug: benchmark.slug, cycleId: cycle.id }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; cycleId: string }>
}): Promise<Metadata> {
  const { slug, cycleId } = await params
  const benchmark = getBenchmark(slug)
  const cycle = getCycle(slug, cycleId)
  return benchmark && cycle ? { title: `${benchmark.title} · ${cycle.id}`, description: `Reviewed results for ${benchmark.title}, cycle ${cycle.id}.` } : {}
}

export default async function CyclePage({
  params,
}: {
  params: Promise<{ slug: string; cycleId: string }>
}) {
  const { slug, cycleId } = await params
  const benchmark = getBenchmark(slug)
  const cycle = getCycle(slug, cycleId)
  if (!benchmark || !cycle) notFound()
  const meta = getRepoMeta()
  const sourceUrl = `${meta.githubUrl}/tree/main/${benchmark.githubPath}`
  const reportUrl = `${meta.githubUrl}/blob/main/${benchmark.githubPath}/benchmark/cycles/${cycle.id}/report/report.md`
  const qualityPoints = cycle.scores.filter((score) => score.total != null).map((score) => ({ id: score.id, score: score.total as number, rank: score.rank, judgeRank: score.judgeRank }))
  const tradeoffPoints = cycle.runs.filter((run) => run.score != null && run.costUsd != null).map((run) => ({ id: run.id, score: run.score as number, rank: run.rank, judgeRank: run.judgeRank, cost: run.costUsd as number, tokens: run.tokens }))

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
      <nav className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground" aria-label="Breadcrumb"><Link href={`/benchmarks/${benchmark.slug}`} className="inline-flex items-center gap-1 hover:text-foreground"><ArrowLeft className="size-3" /> {benchmark.title}</Link><span>/</span><span className="text-foreground">{cycle.id}</span></nav>
      <header className="mt-7 border-b border-border/60 pb-8"><div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"><span>{cycle.releaseType ?? "release unavailable"}</span><span>·</span><span>{cycle.status ?? "status unavailable"}</span><span>·</span><span>publication {cycle.publicationSequence ?? "unavailable"}</span></div><div className="mt-3 flex flex-wrap items-end justify-between gap-5"><div><h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">{cycle.id}</h1><p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">Exact reviewed cohort for <Link href={`/benchmarks/${benchmark.slug}`} className="text-foreground underline underline-offset-4">{benchmark.title}</Link>. The cycle is immutable and remains addressable after a newer publication.</p></div><div className="flex flex-wrap gap-2"><a href={reportUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground">Open report <ArrowUpRight className="size-3.5" /></a><a href={sourceUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center rounded-md border border-border px-3.5 text-sm font-medium hover:bg-muted">GitHub source</a></div></div></header>

      <section className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"><Metric label="Cohort" value={cycle.runCount.toString()} detail="reviewed run records" /><Metric label="Top score" value={cycle.scores[0]?.total == null ? "Unavailable" : cycle.scores[0].total.toFixed(2)} detail={cycle.scores[0]?.id ?? "No scored candidate"} /><Metric label="Accounting tokens" value={formatTokens(cycle.accountingTotal?.tokens ?? null)} detail={`${formatInteger(cycle.accountingTotal?.threadCount ?? null)} discovered threads`} /><Metric label="Published" value={formatDate(cycle.publishedAt)} detail={cycle.sourceDigest?.slice(0, 12) ?? "Digest unavailable"} /></section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]"><main className="min-w-0 space-y-8">
        <section className="rounded-lg border border-border bg-card p-5 sm:p-6"><Heading kicker="01 · quality" title="Cohort leaderboard" body="Higher is better. Exact values are available in the table below the chart." /><div className="mt-5"><QualityChart points={qualityPoints} /></div><p className="mt-3 font-mono text-[10px] text-muted-foreground">{qualityPoints.length} scored candidates · aggregate rank · reviewed source {cycle.sourceDigest?.slice(0, 16) ?? "unavailable"}</p><div className="mt-5 overflow-x-auto rounded-md border border-border"><table className="w-full min-w-[620px] text-sm"><caption className="sr-only">Cycle quality scores.</caption><thead><tr className="border-b border-border bg-muted/50 text-left font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase"><th scope="col" className="px-3 py-2.5">Rank</th><th scope="col" className="px-3 py-2.5">Candidate</th><th scope="col" className="px-3 py-2.5 text-right">Score</th><th scope="col" className="px-3 py-2.5 text-right">Judge rank</th><th scope="col" className="px-3 py-2.5">Dimension sample</th></tr></thead><tbody>{cycle.scores.map((score) => <tr key={`${score.id}-${score.rank}`} className="border-b border-border/70 last:border-0"><td className="px-3 py-2.5 font-mono text-xs">{score.rank ?? "Unavailable"}</td><td className="px-3 py-2.5 font-mono text-xs">{score.id}</td><td className="px-3 py-2.5 text-right font-semibold tabular-nums">{score.total?.toFixed(2) ?? "Unavailable"}</td><td className="px-3 py-2.5 text-right font-mono text-xs">{score.judgeRank ?? "Unavailable"}</td><td className="px-3 py-2.5 text-xs text-muted-foreground">{Object.entries(score.dimensions).slice(0, 3).map(([key, value]) => `${humanizeKey(key)} ${value}`).join(" · ") || "Unavailable"}</td></tr>)}</tbody></table></div></section>

        <section className="rounded-lg border border-border bg-card p-5 sm:p-6"><Heading kicker="02 · cost and time" title="Observed trade-offs" body="Only runs with both an observed score and observed cost appear in this scatterplot." /><div className="mt-5"><CostQualityChart points={tradeoffPoints} /></div><p className="mt-3 font-mono text-[10px] text-muted-foreground">X: run cost in USD · Y: score out of 10 · {tradeoffPoints.length} comparable pairs</p></section>

        <section className="rounded-lg border border-border bg-card p-5 sm:p-6"><Heading kicker="03 · run records" title="Read-only run catalog" body="Run-owned apps, prompts, evidence, and reports are inputs only. Open a row for the exact reviewed metadata." /><div className="mt-5"><RunTable runs={cycle.runs} benchmarkSlug={benchmark.slug} cycleId={cycle.id} /></div></section>

        <section className="rounded-lg border border-border bg-card p-5 sm:p-6"><Heading kicker="04 · accounting scopes" title="Every discovered work scope" body="Null cost means the source did not establish a price for every thread in that scope; it is not zero." /><div className="mt-5 overflow-x-auto rounded-md border border-border"><table className="w-full min-w-[700px] text-sm"><caption className="sr-only">Accounting scopes for this cycle.</caption><thead><tr className="border-b border-border bg-muted/50 text-left font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase"><th scope="col" className="px-3 py-2.5">Scope</th><th scope="col" className="px-3 py-2.5 text-right">Threads</th><th scope="col" className="px-3 py-2.5 text-right">Tokens</th><th scope="col" className="px-3 py-2.5 text-right">Cost</th><th scope="col" className="px-3 py-2.5">Coverage</th></tr></thead><tbody>{[...cycle.accountingScopes, ...(cycle.accountingTotal ? [cycle.accountingTotal] : [])].map((scope) => <tr key={scope.id} className="border-b border-border/70 last:border-0"><td className="px-3 py-2.5">{scope.label}</td><td className="px-3 py-2.5 text-right font-mono text-xs">{formatInteger(scope.threadCount)}</td><td className="px-3 py-2.5 text-right font-mono text-xs">{formatTokens(scope.tokens)}</td><td className="px-3 py-2.5 text-right font-mono text-xs">{formatUsd(scope.costUsd)}</td><td className="px-3 py-2.5 text-xs text-muted-foreground">{scope.knownCostThreads == null || scope.threadCount == null ? "Unavailable" : `${scope.knownCostThreads}/${scope.threadCount} priced`}</td></tr>)}</tbody></table></div></section>
      </main><aside className="space-y-4"><section className="rounded-lg border border-border bg-card p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Cycle scope</p><div className="mt-4 space-y-3"><Info label="Previous cycle" value={cycle.previousCycleId ?? "None"} /><Info label="Review status" value={cycle.status ?? "Unavailable"} /><Info label="Generated" value={formatDate(cycle.generatedAt)} /><Info label="Reviewed" value={formatDate(cycle.reviewedAt)} /></div></section><section className="rounded-lg border border-border bg-card p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Metadata coverage</p><div className="mt-4 space-y-2">{Object.entries(cycle.metadataCoverage).map(([key, value]) => <div key={key} className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 text-xs last:border-0"><span className="text-muted-foreground">{humanizeKey(key)}</span><span className="text-right font-mono">{formatMaybe(value)}</span></div>)}</div></section><section className="rounded-lg border border-border bg-card p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Evidence surfaces</p><div className="mt-4 space-y-2">{(benchmark.evidenceSurfaces.length ? benchmark.evidenceSurfaces : ["unavailable"]).map((surface) => <div key={surface} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />{surface}</div>)}</div></section><section className="rounded-lg border border-border bg-muted/30 p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Provenance</p><div className="mt-4 space-y-2 text-xs"><Info label="Source digest" value={cycle.sourceDigest?.slice(0, 20) ?? "Unavailable"} /><Info label="Prompt template" value={formatMaybe(cycle.lifecycle.promptTemplateSha).slice(0, 20)} /><Info label="Coverage" value={Object.keys(cycle.coverage).length ? "Recorded" : "Unavailable"} /></div></section></aside></div>

      <section id="run-this-benchmark" className="mt-10 grid gap-4 border-t border-border/60 pt-8 lg:grid-cols-2"><div className="rounded-lg border border-border bg-card p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Reproduce this cycle</p><h2 className="mt-2 text-xl font-semibold tracking-tight">Run this benchmark</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Run the benchmark from its repository, then compare your output with this exact cycle result.</p><TerminalBlock className="mt-4" lines={[`cd ${benchmark.githubPath}`, "npm install", "npm run build"]} /><div className="mt-4 flex flex-wrap gap-4 font-mono text-[10px] text-muted-foreground"><a href={sourceUrl} target="_blank" rel="noreferrer" className="hover:text-foreground hover:underline">GitHub repository</a><a href={reportUrl} target="_blank" rel="noreferrer" className="hover:text-foreground hover:underline">Exact cycle results</a></div></div><div className="rounded-lg border border-border bg-muted/30 p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Create another campaign</p><h2 className="mt-2 text-xl font-semibold tracking-tight">Run your own benchmark</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Use the benchmark plugin to create a new reproducible benchmark and publish its reviewed lifecycle.</p><a href="https://ai.rj11.io/plugins/benchmarks" target="_blank" rel="noreferrer" className="mt-5 inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground">Open benchmark plugin <ArrowUpRight className="size-3.5" /></a></div></section>
    </div>
  )
}

function Heading({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return <div><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">{kicker}</p><h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{body}</p></div>
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="bg-card px-4 py-4 sm:px-5"><p className="font-mono text-[10px] tracking-[0.13em] text-muted-foreground uppercase">{label}</p><p className="mt-2 text-lg font-semibold tabular-nums">{value}</p><p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{detail}</p></div>
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 text-xs last:border-0"><span className="text-muted-foreground">{label}</span><span className="text-right font-mono">{value}</span></div>
}
