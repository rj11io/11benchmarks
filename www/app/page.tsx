import Link from "next/link"
import {
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Database,
  GitBranch,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { GitHubIcon } from "@/components/site/github-icon"
import { TerminalBlock } from "@/components/site/terminal-block"
import {
  formatDate,
  formatInteger,
  formatTokens,
  formatUsd,
  getBenchmarks,
  getRepoMeta,
  getRepoPitch,
  getTotals,
  type Benchmark,
} from "@/lib/bench"

type SearchParams = Promise<Record<string, string | string[] | undefined>>
type Params = Record<string, string | string[] | undefined>

function value(params: Params, key: string): string {
  const item = params[key]
  return Array.isArray(item) ? (item[0] ?? "") : (item ?? "")
}

function matches(
  benchmark: Benchmark,
  key: "providers" | "harnesses" | "models" | "efforts",
  selected: string
): boolean {
  if (!selected) return true
  return benchmark[key].includes(selected)
}

function filterBenchmarks(benchmarks: Benchmark[], params: Params): Benchmark[] {
  const query = value(params, "q").trim().toLowerCase()
  const status = value(params, "status")
  const provider = value(params, "provider")
  const harness = value(params, "harness")
  const model = value(params, "model")
  const effort = value(params, "effort")
  const sort = value(params, "sort") || "newest"
  const filtered = benchmarks.filter((benchmark) => {
    const haystack = [
      benchmark.title,
      benchmark.objective,
      ...benchmark.skillTags,
      ...benchmark.providers,
      ...benchmark.harnesses,
      ...benchmark.models,
      ...benchmark.efforts,
    ]
      .join(" ")
      .toLowerCase()
    return (
      (!query || haystack.includes(query)) &&
      (!status || benchmark.campaignStatus === status) &&
      matches(benchmark, "providers", provider) &&
      matches(benchmark, "harnesses", harness) &&
      matches(benchmark, "models", model) &&
      matches(benchmark, "efforts", effort)
    )
  })
  return [...filtered].sort((a, b) => {
    if (sort === "runs") return b.runCount - a.runCount
    if (sort === "score")
      return (
        (b.latestCycle?.scores[0]?.total ?? -1) -
        (a.latestCycle?.scores[0]?.total ?? -1)
      )
    if (sort === "cost")
      return (
        (a.totalAccountingCostUsd ?? Number.POSITIVE_INFINITY) -
        (b.totalAccountingCostUsd ?? Number.POSITIVE_INFINITY)
      )
    if (sort === "coverage")
      return (
        (b.eligibleRunCount ?? -1) / Math.max(b.runCount, 1) -
        (a.eligibleRunCount ?? -1) / Math.max(a.runCount, 1)
      )
    if (sort === "name") return a.title.localeCompare(b.title)
    return (
      new Date(b.generatedAt ?? 0).getTime() -
      new Date(a.generatedAt ?? 0).getTime()
    )
  })
}

function options(benchmarks: Benchmark[], key: "providers" | "harnesses" | "models" | "efforts") {
  return [...new Set(benchmarks.flatMap((benchmark) => benchmark[key]))].sort()
}

function statusLabel(benchmark: Benchmark): string {
  return benchmark.campaignStatus === "open"
    ? "campaign open"
    : (benchmark.campaignStatus ?? "status unavailable")
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const meta = getRepoMeta()
  const pitch = getRepoPitch()
  const benchmarks = getBenchmarks()
  const visible = filterBenchmarks(benchmarks, params)
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

      <section id="catalog" className="scroll-mt-20 border-t border-border/60 py-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Catalog</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Benchmark suites</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Search reviewed objectives and run metadata. Filters, sort, and
              selected facets remain in the URL for shareable views.
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground">{visible.length} of {benchmarks.length} shown</span>
        </div>

        <form method="get" className="mt-6 grid gap-2 rounded-lg border border-border bg-muted/30 p-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="relative sm:col-span-2 lg:col-span-2">
            <span className="sr-only">Search benchmarks, providers, models, or skills</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              defaultValue={value(params, "q")}
              placeholder="Search benchmark, model, provider, skill"
              className="h-10 w-full rounded-md border border-border bg-background pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <Select name="status" value={value(params, "status")} label="Lifecycle">
            <option value="">All lifecycle states</option>
            <option value="open">Campaign open</option>
          </Select>
          <Select name="sort" value={value(params, "sort") || "newest"} label="Sort">
            <option value="newest">Newest reviewed</option>
            <option value="name">Name</option>
            <option value="score">Top score</option>
            <option value="runs">Most runs</option>
            <option value="coverage">Best coverage</option>
            <option value="cost">Lowest priced total</option>
          </Select>
          <Select name="provider" value={value(params, "provider")} label="Provider">
            <option value="">All providers</option>
            {options(benchmarks, "providers").map((option) => <option key={option}>{option}</option>)}
          </Select>
          <Select name="harness" value={value(params, "harness")} label="Harness">
            <option value="">All harnesses</option>
            {options(benchmarks, "harnesses").map((option) => <option key={option}>{option}</option>)}
          </Select>
          <Select name="model" value={value(params, "model")} label="Model">
            <option value="">All models</option>
            {options(benchmarks, "models").map((option) => <option key={option}>{option}</option>)}
          </Select>
          <Select name="effort" value={value(params, "effort")} label="Effort">
            <option value="">All effort levels</option>
            {options(benchmarks, "efforts").map((option) => <option key={option}>{option}</option>)}
          </Select>
          <div className="flex items-end gap-2 lg:col-span-2">
            <button type="submit" className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Apply filters</button>
            <Link href="#catalog" className="inline-flex h-10 items-center rounded-md border border-border px-3 text-sm hover:bg-muted">Reset</Link>
            <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground"><SlidersHorizontal className="size-3" /> URL-persisted</span>
          </div>
        </form>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {visible.map((benchmark) => <BenchmarkCard key={benchmark.slug} benchmark={benchmark} meta={meta} />)}
        </div>
        {visible.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No reviewed benchmark matches these filters. Reset the URL facets to see the full catalog.
          </div>
        ) : null}
      </section>

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

function BenchmarkCard({ benchmark, meta }: { benchmark: Benchmark; meta: ReturnType<typeof getRepoMeta> }) {
  const winner = benchmark.latestCycle?.scores[0]
  const latest = benchmark.latestCycle
  const sourceUrl = `${meta.githubUrl}/tree/main/${benchmark.githubPath}`
  const reportUrl = latest
    ? `${meta.githubUrl}/blob/main/${benchmark.githubPath}/benchmark/cycles/${latest.id}/report/report.md`
    : sourceUrl
  return (
    <article className="flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">{statusLabel(benchmark)} · {latest?.releaseType ?? "unpublished"}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight"><Link href={`/benchmarks/${benchmark.slug}`} className="hover:underline underline-offset-4">{benchmark.title}</Link></h3>
        </div>
        <GitBranch className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{benchmark.objective}</p>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-border pt-4 sm:grid-cols-4">
        <Stat label="Runs" value={formatInteger(benchmark.runCount)} />
        <Stat label="Eligible" value={benchmark.eligibleRunCount == null ? "Unavailable" : `${benchmark.eligibleRunCount}/${benchmark.runCount}`} />
        <Stat label="Top score" value={winner?.total?.toFixed(2) ?? "Unavailable"} />
        <Stat label="Total cost" value={formatUsd(benchmark.totalAccountingCostUsd)} />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {[latest?.id, benchmark.pricing ? `pricing ${benchmark.pricing}` : "pricing unavailable", ...benchmark.evidenceSurfaces.slice(0, 3)].filter(Boolean).map((tag) => (
          <span key={tag} className="rounded border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground">{tag}</span>
        ))}
      </div>
      <div className="mt-5 grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
        <div className="rounded-md bg-muted/40 p-3">
          <Link href={`/benchmarks/${benchmark.slug}#run-this-benchmark`} className="text-sm font-medium hover:underline underline-offset-4">Run this benchmark <ArrowUpRight className="ml-1 inline size-3.5" /></Link>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">cd {benchmark.githubPath} · npm install · npm run build</p>
        </div>
        <div className="rounded-md bg-muted/40 p-3">
          <a href="https://ai.rj11.io/plugins/benchmarks" target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline underline-offset-4">Run your own benchmark <ArrowUpRight className="ml-1 inline size-3.5" /></a>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Create a new reviewed benchmark campaign.</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 font-mono text-[10px] text-muted-foreground">
        <a href={sourceUrl} target="_blank" rel="noreferrer" className="hover:text-foreground hover:underline">GitHub source</a>
        <a href={reportUrl} target="_blank" rel="noreferrer" className="hover:text-foreground hover:underline">Reviewed results</a>
        <Link href={`/benchmarks/${benchmark.slug}`} className="ml-auto hover:text-foreground hover:underline">Explore suite →</Link>
      </div>
      <p className="mt-3 font-mono text-[10px] text-muted-foreground">Updated {formatDate(benchmark.generatedAt)}</p>
    </article>
  )
}

function Select({ name, value, label, children }: { name: string; value: string; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select name={name} defaultValue={value} aria-label={label} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">{children}</select>
    </label>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div className="bg-card px-4 py-4 sm:px-5"><p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">{label}</p><p className="mt-2 text-xl font-semibold tabular-nums">{value}</p></div>
}

function Signal({ icon: Icon, label, value }: { icon: typeof Database; label: string; value: string }) {
  return <div className="rounded-lg border border-border bg-card p-4"><Icon className="size-4 text-muted-foreground" /><p className="mt-3 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div><p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">{label}</p><p className="mt-1 text-sm font-semibold tabular-nums">{value}</p></div>
}
