"use client"

import { useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { ArrowUpRight, GitBranch, Search, SlidersHorizontal } from "lucide-react"

import type { CatalogBenchmark, RepoMeta } from "@/lib/bench"

type FilterValues = {
  q: string
  status: string
  provider: string
  harness: string
  model: string
  effort: string
  sort: string
}

const EMPTY_FILTERS: FilterValues = {
  q: "",
  status: "",
  provider: "",
  harness: "",
  model: "",
  effort: "",
  sort: "newest",
}

function filtersFromUrl(params: ReadonlyURLSearchParams): FilterValues {
  return {
    q: params.get("q") ?? "",
    status: params.get("status") ?? "",
    provider: params.get("provider") ?? "",
    harness: params.get("harness") ?? "",
    model: params.get("model") ?? "",
    effort: params.get("effort") ?? "",
    sort: params.get("sort") || "newest",
  }
}

function filterBenchmarks(
  benchmarks: CatalogBenchmark[],
  filters: FilterValues
): CatalogBenchmark[] {
  const query = filters.q.trim().toLowerCase()
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
      (!filters.status || benchmark.campaignStatus === filters.status) &&
      (!filters.provider || benchmark.providers.includes(filters.provider)) &&
      (!filters.harness || benchmark.harnesses.includes(filters.harness)) &&
      (!filters.model || benchmark.models.includes(filters.model)) &&
      (!filters.effort || benchmark.efforts.includes(filters.effort))
    )
  })

  return [...filtered].sort((a, b) => {
    if (filters.sort === "runs") return b.runCount - a.runCount
    if (filters.sort === "score") {
      return (
        (b.latestCycle?.scores[0]?.total ?? -1) -
        (a.latestCycle?.scores[0]?.total ?? -1)
      )
    }
    if (filters.sort === "cost") {
      return (
        (a.totalAccountingCostUsd ?? Number.POSITIVE_INFINITY) -
        (b.totalAccountingCostUsd ?? Number.POSITIVE_INFINITY)
      )
    }
    if (filters.sort === "coverage") {
      return (
        (b.eligibleRunCount ?? -1) / Math.max(b.runCount, 1) -
        (a.eligibleRunCount ?? -1) / Math.max(a.runCount, 1)
      )
    }
    if (filters.sort === "name") return a.title.localeCompare(b.title)
    return (
      new Date(b.generatedAt ?? 0).getTime() -
      new Date(a.generatedAt ?? 0).getTime()
    )
  })
}

function options(
  benchmarks: CatalogBenchmark[],
  key: "providers" | "harnesses" | "models" | "efforts"
) {
  return [...new Set(benchmarks.flatMap((benchmark) => benchmark[key]))].sort()
}

function statusLabel(benchmark: CatalogBenchmark): string {
  return benchmark.campaignStatus === "open"
    ? "campaign open"
    : (benchmark.campaignStatus ?? "status unavailable")
}

function formatInteger(value: number | null): string {
  return value == null ? "—" : Math.round(value).toLocaleString("en-US")
}

function formatUsd(value: number | null): string {
  return value == null ? "—" : `$${value.toFixed(2)}`
}

function formatDate(value: string | null): string {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
}

export default function CatalogExplorer({
  benchmarks,
  meta,
}: {
  benchmarks: CatalogBenchmark[]
  meta: RepoMeta
}) {
  const searchParams = useSearchParams()
  return (
    <CatalogContent
      key={searchParams.toString()}
      benchmarks={benchmarks}
      meta={meta}
      initialFilters={filtersFromUrl(searchParams)}
    />
  )
}

function CatalogContent({
  benchmarks,
  meta,
  initialFilters,
}: {
  benchmarks: CatalogBenchmark[]
  meta: RepoMeta
  initialFilters: FilterValues
}) {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterValues>(initialFilters)
  const visible = useMemo(
    () => filterBenchmarks(benchmarks, filters),
    [benchmarks, filters]
  )

  function updateFilter(key: keyof FilterValues, value: string) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(filters)) {
      if (value && !(key === "sort" && value === "newest")) query.set(key, value)
    }
    const suffix = query.toString()
    router.replace(suffix ? `/?${suffix}#catalog` : "/#catalog")
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS)
    router.replace("/#catalog")
  }

  return (
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

      <form onSubmit={applyFilters} className="mt-6 grid gap-2 rounded-lg border border-border bg-muted/30 p-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="relative sm:col-span-2 lg:col-span-2">
          <span className="sr-only">Search benchmarks, providers, models, or skills</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            value={filters.q}
            onChange={(event) => updateFilter("q", event.currentTarget.value)}
            placeholder="Search benchmark, model, provider, skill"
            className="h-10 w-full rounded-md border border-border bg-background pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <Select name="status" value={filters.status} label="Lifecycle" onChange={(value) => updateFilter("status", value)}>
          <option value="">All lifecycle states</option>
          <option value="open">Campaign open</option>
        </Select>
        <Select name="sort" value={filters.sort} label="Sort" onChange={(value) => updateFilter("sort", value)}>
          <option value="newest">Newest reviewed</option>
          <option value="name">Name</option>
          <option value="score">Top score</option>
          <option value="runs">Most runs</option>
          <option value="coverage">Best coverage</option>
          <option value="cost">Lowest priced total</option>
        </Select>
        <Select name="provider" value={filters.provider} label="Provider" onChange={(value) => updateFilter("provider", value)}>
          <option value="">All providers</option>
          {options(benchmarks, "providers").map((option) => <option key={option}>{option}</option>)}
        </Select>
        <Select name="harness" value={filters.harness} label="Harness" onChange={(value) => updateFilter("harness", value)}>
          <option value="">All harnesses</option>
          {options(benchmarks, "harnesses").map((option) => <option key={option}>{option}</option>)}
        </Select>
        <Select name="model" value={filters.model} label="Model" onChange={(value) => updateFilter("model", value)}>
          <option value="">All models</option>
          {options(benchmarks, "models").map((option) => <option key={option}>{option}</option>)}
        </Select>
        <Select name="effort" value={filters.effort} label="Effort" onChange={(value) => updateFilter("effort", value)}>
          <option value="">All effort levels</option>
          {options(benchmarks, "efforts").map((option) => <option key={option}>{option}</option>)}
        </Select>
        <div className="flex items-end gap-2 lg:col-span-2">
          <button type="submit" className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Apply filters</button>
          <button type="button" onClick={resetFilters} className="inline-flex h-10 items-center rounded-md border border-border px-3 text-sm hover:bg-muted">Reset</button>
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
  )
}

function BenchmarkCard({ benchmark, meta }: { benchmark: CatalogBenchmark; meta: RepoMeta }) {
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

function Select({
  name,
  value,
  label,
  onChange,
  children,
}: {
  name: string
  value: string
  label: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select name={name} value={value} onChange={(event) => onChange(event.currentTarget.value)} aria-label={label} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">{children}</select>
    </label>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div><p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">{label}</p><p className="mt-1 text-sm font-semibold tabular-nums">{value}</p></div>
}
