import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react"
import { notFound } from "next/navigation"

import { GitHubIcon } from "@/components/site/github-icon"
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
  getRepoMeta,
  humanizeKey,
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
  return benchmark ? { title: benchmark.title, description: benchmark.objective } : {}
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
  const winner = latest?.scores[0]
  const sourceUrl = `${meta.githubUrl}/tree/main/${benchmark.githubPath}`
  const reportUrl = latest
    ? `${meta.githubUrl}/blob/main/${benchmark.githubPath}/benchmark/cycles/${latest.id}/report/report.md`
    : sourceUrl
  const qualityPoints = (latest?.scores ?? [])
    .filter((score) => score.total != null)
    .map((score) => ({ id: score.id, score: score.total as number, rank: score.rank, judgeRank: score.judgeRank }))
  const tradeoffPoints = (latest?.runs ?? [])
    .filter((run) => run.score != null && run.costUsd != null)
    .map((run) => ({ id: run.id, score: run.score as number, rank: run.rank, judgeRank: run.judgeRank, cost: run.costUsd as number, tokens: run.tokens }))
  const dimensions = [...new Set((latest?.scores ?? []).flatMap((score) => Object.keys(score.dimensions)))]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
      <nav className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground"><ArrowLeft className="size-3" /> Catalog</Link>
        <span>/</span>
        <span className="text-foreground">{benchmark.title}</span>
      </nav>

      <header className="mt-7 grid gap-7 border-b border-border/60 pb-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            <span>{benchmark.campaignStatus ?? "status unavailable"}</span><span>·</span><span>{latest?.releaseType ?? "unpublished"}</span><span>·</span><span>{latest?.id ?? "no cycle"}</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">{benchmark.title}</h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground">{benchmark.objective}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(benchmark.skillTags.length ? benchmark.skillTags : ["skill tags unavailable"]).map((tag) => <span key={tag} className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground">{tag}</span>)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3.5 text-sm font-medium hover:bg-muted"><GitHubIcon className="size-4" /> GitHub source</a>
          <a href={reportUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground">Reviewed report <ArrowUpRight className="size-3.5" /></a>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border" aria-label="Benchmark summary">
        <Metric label="Latest winner" value={winner?.total == null ? "Unavailable" : `${winner.total.toFixed(2)} / 10`} detail={winner ? `${winner.id} · #${winner.rank ?? "—"} of ${qualityPoints.length}` : "No reviewed score"} />
        <Metric label="Eligible / registered" value={benchmark.eligibleRunCount == null ? "Unavailable" : `${benchmark.eligibleRunCount} / ${benchmark.runCount}`} detail={benchmark.campaignStatus ?? "status unavailable"} />
        <Metric label="Accounting total" value={formatUsd(benchmark.totalAccountingCostUsd)} detail={benchmark.pricing ?? "pricing unavailable"} />
        <Metric label="Accounted tokens" value={formatTokens(benchmark.totalTokens)} detail={`${benchmark.judgeCounts.total} judge · ${benchmark.judgeCounts.ai} AI · ${benchmark.judgeCounts.human} human`} />
      </section>

      <nav className="sticky top-14 z-[5] -mx-4 mt-6 overflow-x-auto border-y border-border/60 bg-background/90 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-md sm:border" aria-label="Benchmark sections">
        <div className="flex min-w-max gap-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
          <a href="#quality" className="hover:text-foreground">Quality</a><a href="#accounting" className="hover:text-foreground">Accounting</a><a href="#runs" className="hover:text-foreground">Runs</a><a href="#history" className="hover:text-foreground">History</a><a href="#run-this-benchmark" className="hover:text-foreground">Reproduce</a>
        </div>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0 space-y-8">
          <section id="quality" className="scroll-mt-28 rounded-lg border border-border bg-card p-5 sm:p-6">
            <SectionHeading kicker="01 · quality" title="Latest quality leaderboard" description="Reviewed aggregate score. Higher is better; maximum score is 10. The chart and table show the same selected cohort." />
            <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <QualityChart points={qualityPoints} />
                <p className="mt-3 font-mono text-[10px] text-muted-foreground">Scope: {qualityPoints.length} scored candidates · cycle {latest?.id ?? "unavailable"} · source {latest?.sourceDigest?.slice(0, 12) ?? "unavailable"}</p>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-4">
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Read this view</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Rank is the reviewed aggregate rank. Judge median rank and disagreement remain separate when the source exposes them.</p>
                <div className="mt-4 space-y-2 text-xs text-muted-foreground"><p><span className="mr-2 inline-block size-2 rounded-sm bg-chart-4" />rank 1</p><p><span className="mr-2 inline-block size-2 rounded-sm bg-chart-2" />other ranked candidates</p><p>Unavailable values are not converted to zero.</p></div>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[690px] text-sm">
                <caption className="sr-only">Exact quality leaderboard values.</caption>
                <thead><tr className="border-b border-border bg-muted/50 text-left font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase"><th scope="col" className="px-3 py-2.5">Rank</th><th scope="col" className="px-3 py-2.5">Candidate / run</th><th scope="col" className="px-3 py-2.5 text-right">Score</th><th scope="col" className="px-3 py-2.5 text-right">Judge median</th><th scope="col" className="px-3 py-2.5 text-right">Disagreement</th><th scope="col" className="px-3 py-2.5">Dimensions</th></tr></thead>
                <tbody>{(latest?.scores ?? []).map((score) => <tr key={`${score.id}-${score.rank}`} className="border-b border-border/70 last:border-0"><td className="px-3 py-2.5 font-mono text-xs">{score.rank ?? "Unavailable"}</td><td className="px-3 py-2.5 font-mono text-xs">{score.id}</td><td className="px-3 py-2.5 text-right font-semibold tabular-nums">{score.total?.toFixed(2) ?? "Unavailable"}</td><td className="px-3 py-2.5 text-right font-mono text-xs">{score.judgeRank ?? "Unavailable"}</td><td className="px-3 py-2.5 text-right font-mono text-xs">{score.scoreDisagreement == null ? "Unavailable" : score.scoreDisagreement}</td><td className="px-3 py-2.5"><details><summary className="cursor-pointer text-xs text-muted-foreground">{Object.keys(score.dimensions).length} dimensions</summary><div className="mt-2 grid gap-1 text-xs text-muted-foreground">{Object.entries(score.dimensions).map(([key, value]) => <div key={key} className="flex justify-between gap-4"><span>{humanizeKey(key)}</span><span className="font-mono text-foreground">{value.toFixed(1)}</span></div>)}</div></details></td></tr>)}</tbody>
              </table>
            </div>
            {dimensions.length ? <p className="mt-4 text-xs text-muted-foreground">Dimensions present in this source: {dimensions.map(humanizeKey).join(" · ")}</p> : null}
          </section>

          <section id="accounting" className="scroll-mt-28 rounded-lg border border-border bg-card p-5 sm:p-6">
            <SectionHeading kicker="02 · cost and time" title="Accounting and quality trade-offs" description="Cost and token values are shown with their source semantics. Total cost remains unavailable when the accountant cannot price every discovered thread." />
            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <CostQualityChart points={tradeoffPoints} />
                <p className="mt-3 font-mono text-[10px] text-muted-foreground">X: observed run cost in USD · Y: reviewed score, higher is better · {tradeoffPoints.length} comparable pairs</p>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-4"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Accounting state</p><p className="mt-3 text-sm leading-6 text-muted-foreground">Benchmark run cost and total discovered work are different scopes. Unpriced and unidentified work stays visible below.</p><div className="mt-4 space-y-2 text-xs"><InfoLine label="Threads" value={formatInteger(latest?.accountingTotal?.threadCount ?? null)} /><InfoLine label="Priced threads" value={formatInteger(latest?.accountingTotal?.knownCostThreads ?? null)} /><InfoLine label="Token threads" value={formatInteger(latest?.accountingTotal?.knownTokenThreads ?? null)} /></div></div>
            </div>
            <div className="mt-6 overflow-x-auto rounded-md border border-border"><table className="w-full min-w-[720px] text-sm"><caption className="sr-only">Accounting scopes and exact discovered work totals.</caption><thead><tr className="border-b border-border bg-muted/50 text-left font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase"><th scope="col" className="px-3 py-2.5">Scope</th><th scope="col" className="px-3 py-2.5 text-right">Threads</th><th scope="col" className="px-3 py-2.5 text-right">Tokens</th><th scope="col" className="px-3 py-2.5 text-right">Cost</th><th scope="col" className="px-3 py-2.5 text-right">Price coverage</th></tr></thead><tbody>{[...(latest?.accountingScopes ?? []), ...(latest?.accountingTotal ? [latest.accountingTotal] : [])].map((scope) => <tr key={scope.id} className="border-b border-border/70 last:border-0"><td className="px-3 py-2.5">{scope.label}</td><td className="px-3 py-2.5 text-right font-mono text-xs">{formatInteger(scope.threadCount)}</td><td className="px-3 py-2.5 text-right font-mono text-xs">{formatTokens(scope.tokens)}</td><td className="px-3 py-2.5 text-right font-mono text-xs">{formatUsd(scope.costUsd)}</td><td className="px-3 py-2.5 text-right font-mono text-xs">{scope.knownCostThreads == null || scope.threadCount == null ? "Unavailable" : `${scope.knownCostThreads}/${scope.threadCount}`}</td></tr>)}</tbody></table></div>
          </section>

          <section id="runs" className="scroll-mt-28 rounded-lg border border-border bg-card p-5 sm:p-6">
            <SectionHeading kicker="03 · provenance" title="Read-only run catalog" description="Every row links to a run detail route. This exploration layer does not edit run applications, evidence, prompts, or other run-owned artifacts." />
            <div className="mt-5"><RunTable runs={latest?.runs ?? []} benchmarkSlug={benchmark.slug} cycleId={latest?.id} /></div>
          </section>
        </main>

        <aside className="space-y-4">
          <section className="rounded-lg border border-border bg-card p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Evidence surfaces</p><div className="mt-4 space-y-2">{(benchmark.evidenceSurfaces.length ? benchmark.evidenceSurfaces : ["unavailable"]).map((surface) => <div key={surface} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />{surface}</div>)}</div></section>
          <section className="rounded-lg border border-border bg-card p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Lifecycle and judging</p><div className="mt-4 space-y-3"><InfoLine label="Campaign" value={benchmark.campaignStatus ?? "Unavailable"} /><InfoLine label="Cycle status" value={latest?.status ?? "Unavailable"} /><InfoLine label="Judges" value={`${benchmark.judgeCounts.total} total · ${benchmark.judgeCounts.ai} AI · ${benchmark.judgeCounts.human} human`} /><InfoLine label="Identity blinded" value={formatMaybe(latest?.judging.identityBlinded)} /></div></section>
          <section className="rounded-lg border border-border bg-card p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Metadata coverage</p><div className="mt-4 space-y-2">{Object.entries(benchmark.metadataCoverage).map(([key, value]) => <div key={key} className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 text-xs last:border-0"><span className="text-muted-foreground">{humanizeKey(key)}</span><span className="text-right font-mono">{formatMaybe(value)}</span></div>)}</div></section>
          <section className="rounded-lg border border-border bg-muted/30 p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Source freshness</p><div className="mt-4 space-y-3"><InfoLine label="Generated" value={formatDate(latest?.generatedAt ?? null)} /><InfoLine label="Reviewed" value={formatDate(latest?.reviewedAt ?? null)} /><InfoLine label="Digest" value={latest?.sourceDigest?.slice(0, 16) ?? "Unavailable"} /></div></section>
        </aside>
      </div>

      <section id="history" className="mt-8 scroll-mt-28 border-t border-border/60 pt-8"><SectionHeading kicker="04 · publication history" title="Published cycles" description="Historical cycle URLs remain addressable; the latest pointer changes only after review." /><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{benchmark.cycles.map((cycle) => <Link key={cycle.id} href={`/benchmarks/${benchmark.slug}/cycles/${cycle.id}`} className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/30"><div className="flex items-center justify-between gap-3"><span className="font-mono text-sm">{cycle.id}</span><span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">{cycle.releaseType ?? "unavailable"}</span></div><p className="mt-3 text-sm text-muted-foreground">{cycle.runCount} reviewed runs · {cycle.status ?? "status unavailable"}</p><p className="mt-2 font-mono text-[10px] text-muted-foreground">Published {formatDate(cycle.publishedAt)}</p></Link>)}</div></section>

      <section id="run-this-benchmark" className="mt-10 grid gap-4 border-t border-border/60 pt-8 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Reproduce</p><h2 className="mt-2 text-xl font-semibold tracking-tight">Run this benchmark</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Use the repository’s benchmark directory and its frozen dependency policy. The current reviewed results are linked alongside the source.</p><TerminalBlock className="mt-4" lines={[`cd ${benchmark.githubPath}`, "npm install", "npm run build"]} /><div className="mt-4 flex flex-wrap gap-4 font-mono text-[10px] text-muted-foreground"><a href={sourceUrl} target="_blank" rel="noreferrer" className="hover:text-foreground hover:underline">GitHub repository</a><a href={reportUrl} target="_blank" rel="noreferrer" className="hover:text-foreground hover:underline">Current results</a></div></div>
        <div className="rounded-lg border border-border bg-muted/30 p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Create</p><h2 className="mt-2 text-xl font-semibold tracking-tight">Run your own benchmark</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Create a new benchmark campaign with the benchmark plugin, then publish immutable reviewed cycles with the same provenance vocabulary.</p><a href="https://ai.rj11.io/plugins/benchmarks" target="_blank" rel="noreferrer" className="mt-5 inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground">Open benchmark plugin <ArrowUpRight className="size-3.5" /></a></div>
      </section>
    </div>
  )
}

function SectionHeading({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return <div><p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">{kicker}</p><h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p></div>
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="bg-card px-4 py-4 sm:px-5"><p className="font-mono text-[10px] tracking-[0.13em] text-muted-foreground uppercase">{label}</p><p className="mt-2 text-lg font-semibold tabular-nums">{value}</p><p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{detail}</p></div>
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 text-xs last:border-0"><span className="text-muted-foreground">{label}</span><span className="text-right font-mono">{value}</span></div>
}
