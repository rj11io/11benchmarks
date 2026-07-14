import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { GitHubIcon } from "@/components/site/github-icon"
import { TerminalBlock } from "@/components/site/terminal-block"
import {
  formatUsd,
  getBenchmarks,
  getRepoMeta,
  getRepoPitch,
  getTotals,
} from "@/lib/bench"

export default function Page() {
  const meta = getRepoMeta()
  const pitch = getRepoPitch()
  const benchmarks = getBenchmarks()
  const totals = getTotals()

  const allRuns = benchmarks
    .flatMap((benchmark) => benchmark.runs)
    .sort((a, b) => b.costUsd - a.costUsd)
  const priciest = allRuns[0]
  const cheapest = allRuns[allRuns.length - 1]
  const spread =
    priciest && cheapest && cheapest.costUsd > 0
      ? Math.round(priciest.costUsd / cheapest.costUsd)
      : null
  const cacheRates = allRuns
    .map((run) => run.cacheHitRate)
    .filter((rate): rate is number => rate != null)
  const cacheMin = cacheRates.length ? Math.min(...cacheRates) : null
  const cacheMax = cacheRates.length ? Math.max(...cacheRates) : null

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      {/* Hero */}
      <section className="flex flex-col items-start gap-6 py-16 sm:py-24">
        <div className="text-muted-foreground flex flex-wrap gap-2 font-mono text-[11px]">
          {[
            meta.version ? `v${meta.version}` : null,
            `${totals.benchmarks} ${totals.benchmarks === 1 ? "benchmark" : "benchmarks"}`,
            `${totals.runs} measured runs`,
            totals.runCostUsd > 0 ? `${formatUsd(totals.runCostUsd)} spent` : null,
          ]
            .filter((stat): stat is string => stat != null)
            .map((stat) => (
              <span
                key={stat}
                className="border-border bg-card rounded-full border px-2.5 py-1"
              >
                {stat}
              </span>
            ))}
        </div>
        <h1 className="text-foreground max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Give every coding agent the same task. Measure what comes back.
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
          {pitch}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="#benchmarks"
            className="bg-primary text-primary-foreground inline-flex h-10 items-center rounded-md px-4 text-sm font-medium transition-opacity hover:opacity-90"
          >
            Explore the benchmarks
          </Link>
          <a
            href={meta.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="border-border hover:bg-muted inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors"
          >
            <GitHubIcon className="size-4" />
            GitHub
          </a>
        </div>
        <TerminalBlock
          className="w-full max-w-xl"
          lines={[`git clone ${meta.githubUrl}.git`, "cd 11bench/www && npm install && npm run dev"]}
        />
      </section>

      {/* How it works */}
      <section className="border-border/60 border-t py-16">
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          How a benchmark works
        </h2>
        <p className="text-muted-foreground mt-2 max-w-xl leading-relaxed">
          Every experiment holds the work constant so the only variable left is
          the model. Three steps, repeated per agent:
        </p>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Freeze one task",
              body: "A single prompt file spells out the job and the rules: same content, same component library, no new dependencies. Every agent gets the identical text.",
            },
            {
              step: "02",
              title: "Run every agent",
              body: "Each model builds its answer in its own folder in the repo. Nothing is shared between runs except the frozen inputs, so results are side-by-side comparable.",
            },
            {
              step: "03",
              title: "Measure everything",
              body: "Token counts and dollar costs are read from the harness's own session transcripts and priced with verified per-model rates — not estimated.",
            },
          ].map((item) => (
            <li
              key={item.step}
              className="border-border bg-card rounded-lg border p-5"
            >
              <span className="text-muted-foreground font-mono text-xs">
                {item.step}
              </span>
              <h3 className="text-foreground mt-2 font-medium">{item.title}</h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Benchmark catalog */}
      <section id="benchmarks" className="border-border/60 scroll-mt-20 border-t py-16">
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          Benchmarks
        </h2>
        <p className="text-muted-foreground mt-2 max-w-xl leading-relaxed">
          Scanned from the repository at build time — a new benchmark folder
          shows up here on the next build, no site changes needed.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {benchmarks.map((benchmark) => (
            <Link
              key={benchmark.slug}
              href={`/benchmarks/${benchmark.slug}`}
              className="group border-border bg-card hover:border-foreground/25 flex flex-col gap-3 rounded-lg border p-5 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-foreground font-mono text-sm font-semibold">
                  {benchmark.title}
                </h3>
                <ArrowUpRight className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors" />
              </div>
              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {benchmark.pitch}
              </p>
              <div className="text-muted-foreground mt-auto flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                {benchmark.runs.length > 0 ? (
                  <>
                    <span className="border-border rounded-full border px-2 py-0.5">
                      {benchmark.runs.length} runs measured
                    </span>
                    {benchmark.totalRunCostUsd != null ? (
                      <span className="border-border rounded-full border px-2 py-0.5">
                        {formatUsd(benchmark.totalRunCostUsd)} spent
                      </span>
                    ) : null}
                  </>
                ) : (
                  <span className="border-border rounded-full border px-2 py-0.5">
                    reference content
                  </span>
                )}
                {benchmark.deployedUrl ? (
                  <span className="border-border rounded-full border px-2 py-0.5">
                    live
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Concept spotlight: cache-aware cost accounting */}
      {priciest && cheapest ? (
        <section className="border-border/60 border-t py-16">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">
            Costs are measured, not guessed
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="text-muted-foreground space-y-4 leading-relaxed">
              <p>
                Most agent runs re-read the same files over and over, and API
                providers charge far less for input the model has already seen
                (a &ldquo;cache hit&rdquo;). Runs in this repo were{" "}
                {cacheMin != null && cacheMax != null
                  ? `${Math.round(cacheMin * 100)}–${Math.round(cacheMax * 100)}%`
                  : "heavily"}{" "}
                cached, so pricing every token at the full rate would overstate
                what the runs really cost.
              </p>
              <p>
                11bench prices cache reads and writes separately, using rates
                verified against each provider&apos;s pricing page. A session
                only counts as a benchmark run if it started from the frozen
                prompt and actually wrote files into that run&apos;s folder —
                everything else is bucketed as ordinary repo conversation.
              </p>
            </div>
            <div className="border-border bg-card rounded-lg border p-5">
              <p className="text-muted-foreground font-mono text-xs">
                Same task, real spread
              </p>
              <div className="mt-4 space-y-4">
                {[priciest, cheapest].map((run) => (
                  <div key={run.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-foreground font-mono text-xs">
                        {run.id}
                      </span>
                      <span className="text-foreground font-mono text-sm tabular-nums">
                        {formatUsd(run.costUsd)}
                      </span>
                    </div>
                    <div className="bg-muted mt-1.5 h-2 overflow-hidden rounded-full">
                      <div
                        className="bg-foreground/70 h-full rounded-full"
                        style={{
                          width: `${Math.max((run.costUsd / priciest.costUsd) * 100, 2)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {spread ? (
                <p className="text-muted-foreground mt-5 text-sm leading-relaxed">
                  The most and least expensive builds of the same task are{" "}
                  <span className="text-foreground font-medium">
                    {spread}× apart
                  </span>
                  .
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Final CTA */}
      <section className="border-border/60 border-t py-16">
        <div className="flex flex-col items-start gap-5">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">
            Run it yourself
          </h2>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            Each app in the repository is self-contained: clone, install, and
            start any of them locally.
          </p>
          <TerminalBlock
            className="w-full max-w-xl"
            lines={[`git clone ${meta.githubUrl}.git`, "cd 11bench/www && npm install && npm run dev"]}
          />
        </div>
      </section>
    </div>
  )
}
