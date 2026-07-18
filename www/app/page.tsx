import { Suspense } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Database,
} from "lucide-react"

import CatalogExplorer from "@/components/site/catalog-explorer"
import { GitHubIcon } from "@/components/site/github-icon"
import { TerminalBlock } from "@/components/site/terminal-block"
import {
  formatTokens,
  getBenchmarks,
  getRepoMeta,
  getRepoPitch,
  getTotals,
  toCatalogBenchmark,
} from "@/lib/bench"

export default function Page() {
  const meta = getRepoMeta()
  const pitch = getRepoPitch()
  const benchmarks = getBenchmarks()
  const catalogBenchmarks = benchmarks.map(toCatalogBenchmark)
  const totals = getTotals()
  const eligible = benchmarks.reduce(
    (sum, benchmark) => sum + (benchmark.eligibleRunCount ?? 0),
    0
  )
  const pricedThreads = benchmarks.filter((benchmark) => benchmark.pricing).length
  const uniqueModels = new Set(benchmarks.flatMap((benchmark) => benchmark.models)).size

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <section className="grid gap-10 border-b border-border/60 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            <span className="rounded-full border border-border bg-card px-2.5 py-1">11bench</span>
            <span className="rounded-full border border-border bg-card px-2.5 py-1">review-backed catalog</span>
            <span className="rounded-full border border-border bg-card px-2.5 py-1">
              {meta.version ? `v${meta.version}` : "live"}
            </span>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl">
            Same task. Different agent. Comparable evidence.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {pitch} Explore reviewed quality, judging, accounting, token usage,
            audit state, and run provenance without flattening missing data.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="#catalog"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse the catalog <ArrowUpRight className="size-4" />
            </Link>
            <a
              href={`${meta.githubUrl}/tree/main/v1`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              <GitHubIcon className="size-4" /> Source tree
            </a>
          </div>
        </div>
        <TerminalBlock
          className="w-full"
          lines={[
            "cd v1/<benchmark>",
            "npm install && npm run build",
            "# facts come from reviewed cycle data",
          ]}
        />
      </section>

      <section
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"
        aria-label="Catalog totals"
      >
        <Summary label="Benchmark suites" value={totals.benchmarks.toString()} />
        <Summary label="Registered runs" value={totals.runs.toString()} />
        <Summary label="Eligible / judged" value={eligible.toString()} />
        <Summary label="Reviewed tokens" value={formatTokens(totals.tokens)} />
      </section>

      <section className="grid gap-3 py-8 sm:grid-cols-3">
        <Signal icon={Database} label="Structured sources" value={`${benchmarks.length} reviewed cycles`} />
        <Signal icon={CheckCircle2} label="Evidence coverage" value={`${pricedThreads} of ${benchmarks.length} priced`} />
        <Signal icon={CircleDollarSign} label="Comparison surface" value={`${uniqueModels || "—"} model labels`} />
      </section>

      <Suspense fallback={<CatalogFallback />}>
        <CatalogExplorer benchmarks={catalogBenchmarks} meta={meta} />
      </Suspense>

      <section className="border-t border-border/60 py-10">
        <div className="grid gap-4 rounded-lg border border-border bg-muted/30 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Method</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">A catalog over immutable reviewed cycles.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Scores, prices, ranks, and reconciliation stay owned by the benchmark artifacts. This site only reshapes reviewed fields for navigation, tables, and comparison views.
            </p>
          </div>
          <a href="https://ai.rj11.io/plugins/benchmarks" target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
            Run your own benchmark <ArrowUpRight className="size-4" />
          </a>
        </div>
      </section>
    </div>
  )
}

function CatalogFallback() {
  return (
    <section id="catalog" className="scroll-mt-20 border-t border-border/60 py-10">
      <p className="text-sm text-muted-foreground">Loading catalog…</p>
    </section>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div className="bg-card px-4 py-4 sm:px-5"><p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">{label}</p><p className="mt-2 text-xl font-semibold tabular-nums">{value}</p></div>
}

function Signal({ icon: Icon, label, value }: { icon: typeof Database; label: string; value: string }) {
  return <div className="rounded-lg border border-border bg-card p-4"><Icon className="size-4 text-muted-foreground" /><p className="mt-3 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>
}
