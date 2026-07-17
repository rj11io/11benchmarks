import Link from "next/link"
import {
  ArrowUpRight,
  CheckCircle2,
  Database,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { GitHubIcon } from "@/components/site/github-icon"
import { TerminalBlock } from "@/components/site/terminal-block"
import {
  formatTokens,
  formatUsd,
  getBenchmarks,
  getRepoMeta,
  getRepoPitch,
  getTotals,
  type Benchmark,
} from "@/lib/bench"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function value(
  params: Record<string, string | string[] | undefined>,
  key: string
) {
  const item = params[key]
  return Array.isArray(item) ? (item[0] ?? "") : (item ?? "")
}

function filterBenchmarks(
  benchmarks: Benchmark[],
  params: Record<string, string | string[] | undefined>
) {
  const query = value(params, "q").trim().toLowerCase()
  const status = value(params, "status")
  const sort = value(params, "sort") || "name"
  const filtered = benchmarks.filter((benchmark) => {
    const haystack = [
      benchmark.title,
      benchmark.objective,
      ...benchmark.skillTags,
    ]
      .join(" ")
      .toLowerCase()
    return (
      (!query || haystack.includes(query)) &&
      (!status || benchmark.campaignStatus === status)
    )
  })
  return [...filtered].sort((a, b) => {
    if (sort === "runs") return b.runCount - a.runCount
    if (sort === "score")
      return (
        (b.latestCycle?.scores[0]?.total ?? -1) -
        (a.latestCycle?.scores[0]?.total ?? -1)
      )
    if (sort === "tokens") return (b.totalTokens ?? -1) - (a.totalTokens ?? -1)
    return a.title.localeCompare(b.title)
  })
}

function statusLabel(benchmark: Benchmark) {
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
  const judged = benchmarks.reduce(
    (sum, benchmark) => sum + (benchmark.eligibleRunCount ?? 0),
    0
  )
  const priced = benchmarks.filter((benchmark) => benchmark.pricing).length

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <section className="grid gap-8 border-b border-border/60 py-12 sm:py-16 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div>
          <div className="flex flex-wrap gap-2 font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            <span className="rounded-full border border-border bg-card px-2.5 py-1">
              11bench
            </span>
            <span className="rounded-full border border-border bg-card px-2.5 py-1">
              review-backed explorer
            </span>
            <span className="rounded-full border border-border bg-card px-2.5 py-1">
              {meta.version ? `v${meta.version}` : "live"}
            </span>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
            Same task. Different agent. Comparable evidence.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            {pitch}
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
            "npm install",
            "npm run build",
            "# facts come from reviewed cycle data",
          ]}
        />
      </section>

      <section
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"
        aria-label="Catalog totals"
      >
        {[
          ["Benchmarks", totals.benchmarks.toString()],
          ["Registered runs", totals.runs.toString()],
          ["Eligible / judged", judged.toString()],
          ["Token accounting", formatTokens(totals.tokens)],
        ].map(([label, stat]) => (
          <div key={label} className="bg-card px-4 py-4 sm:px-5">
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              {label}
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums">{stat}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 py-12 sm:grid-cols-3">
        {[
          {
            icon: Database,
            title: "Structured sources",
            body: "Published review data, not rendered report prose, powers every card and detail route.",
          },
          {
            icon: CheckCircle2,
            title: "Honest states",
            body: `${priced} of ${benchmarks.length} suites expose pricing coverage; missing fields stay visible instead of being guessed.`,
          },
          {
            icon: SlidersHorizontal,
            title: "Progressive detail",
            body: "Start with the benchmark catalog, then open a cycle or a read-only run record for provenance.",
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

      <section
        id="catalog"
        className="scroll-mt-20 border-t border-border/60 py-12"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              Catalog
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Benchmark suites
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Search the objective, skill tags, lifecycle, and published run
              history. Every filter is encoded in the URL.
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {visible.length} of {benchmarks.length} shown
          </span>
        </div>

        <form
          method="get"
          className="mt-6 grid gap-2 rounded-lg border border-border bg-muted/30 p-3 sm:grid-cols-[1fr_150px_150px_auto]"
        >
          <label className="sr-only" htmlFor="q">
            Search benchmarks
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="q"
              name="q"
              defaultValue={value(params, "q")}
              placeholder="Search benchmark, objective, skill"
              className="h-10 w-full rounded-md border border-border bg-background pr-3 pl-9 text-sm ring-offset-background outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <select
            name="status"
            defaultValue={value(params, "status")}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All lifecycle states</option>
            <option value="open">Campaign open</option>
          </select>
          <select
            name="sort"
            defaultValue={value(params, "sort") || "name"}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="name">Sort by name</option>
            <option value="runs">Most runs</option>
            <option value="score">Top score</option>
            <option value="tokens">Most tokens</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Apply
            </button>
            <Link
              href="#catalog"
              className="inline-flex h-10 items-center rounded-md border border-border px-3 text-sm hover:bg-muted"
            >
              Reset
            </Link>
          </div>
        </form>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {visible.map((benchmark) => {
            const winner = benchmark.latestCycle?.scores[0]
            return (
              <Link
                key={benchmark.slug}
                href={`/benchmarks/${benchmark.slug}`}
                className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/30 hover:bg-muted/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                      {statusLabel(benchmark)}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight">
                      {benchmark.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {benchmark.objective}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-4">
                  <Stat label="Runs" value={benchmark.runCount.toString()} />
                  <Stat
                    label="Eligible"
                    value={benchmark.eligibleRunCount?.toString() ?? "—"}
                  />
                  <Stat
                    label="Top score"
                    value={winner?.total?.toFixed(2) ?? "—"}
                  />
                  <Stat
                    label="Known run cost"
                    value={formatUsd(benchmark.knownRunCostUsd)}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {[
                    benchmark.latestCycle?.id,
                    benchmark.latestCycle?.releaseType,
                    benchmark.pricing
                      ? `pricing ${benchmark.pricing}`
                      : "pricing unavailable",
                    ...benchmark.evidenceSurfaces.slice(0, 2),
                  ]
                    .filter(Boolean)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </Link>
            )
          })}
        </div>
        {visible.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No published benchmark matches those filters.
          </div>
        ) : null}
      </section>

      <section className="border-t border-border/60 py-12">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              Keep exploring
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              Run it yourself, or run your own.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Read the exact source and cycle provenance, reproduce a benchmark
              locally, or create a new one with the benchmarks plugin.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href="https://ai.rj11.io/plugins/benchmarks"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground"
            >
              Run your own <ArrowUpRight className="ml-1 size-3.5" />
            </a>
            <a
              href={`${meta.githubUrl}/tree/main/v1`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center rounded-md border border-border px-3.5 text-sm font-medium hover:bg-muted"
            >
              Run it yourself
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  )
}
