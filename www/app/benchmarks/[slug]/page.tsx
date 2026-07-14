import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import { GitHubIcon } from "@/components/site/github-icon"
import { RunTable } from "@/components/site/run-table"
import { formatUsd, getBenchmark, getBenchmarks, getRepoMeta } from "@/lib/bench"
import { Markdown } from "@/lib/markdown"

export function generateStaticParams() {
  return getBenchmarks().map((benchmark) => ({ slug: benchmark.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const benchmark = getBenchmark(slug)
  if (!benchmark) return {}
  return {
    title: benchmark.title,
    description: benchmark.pitch,
  }
}

export default async function BenchmarkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const benchmark = getBenchmark(slug)
  if (!benchmark) notFound()

  const meta = getRepoMeta()
  const githubUrl = `${meta.githubUrl}/tree/main/${benchmark.githubPath}`

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
        <Link href="/" className="hover:text-foreground underline-offset-4 hover:underline">
          11bench
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href="/#benchmarks"
          className="hover:text-foreground underline-offset-4 hover:underline"
        >
          benchmarks
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{benchmark.slug}</span>
      </nav>

      <header className="mt-8">
        <h1 className="text-foreground font-mono text-3xl font-semibold tracking-tight">
          {benchmark.title}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl text-lg leading-relaxed">
          {benchmark.pitch}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {benchmark.deployedUrl ? (
            <a
              href={benchmark.deployedUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-primary text-primary-foreground inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 text-sm font-medium transition-opacity hover:opacity-90"
            >
              Open the live site
              <ArrowUpRight className="size-3.5" />
            </a>
          ) : null}
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="border-border hover:bg-muted inline-flex h-9 items-center gap-2 rounded-md border px-3.5 text-sm font-medium transition-colors"
          >
            <GitHubIcon className="size-4" />
            <span className="font-mono text-xs">{benchmark.githubPath}</span>
          </a>
        </div>
      </header>

      {benchmark.runs.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-foreground text-xl font-semibold tracking-tight">
            Measured runs
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {`${benchmark.runs.length} runs`}, read from the benchmark&apos;s
            own cost data
            {benchmark.totalRunCostUsd != null
              ? ` — ${formatUsd(benchmark.totalRunCostUsd)} total`
              : ""}
            . Costs come from harness session transcripts, priced with
            cache-aware, per-model rates.
          </p>
          <div className="mt-4">
            <RunTable runs={benchmark.runs} />
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-foreground text-xl font-semibold tracking-tight">
            README
          </h2>
          <a
            href={`${meta.githubUrl}/blob/main/${benchmark.githubPath}/README.md`}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground font-mono text-xs underline-offset-4 hover:underline"
          >
            view on GitHub
          </a>
        </div>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Rendered in full from the repository — the same file you would read
          in the source tree.
        </p>
        <div className="border-border mt-5 rounded-lg border p-5 text-[15px] sm:p-7">
          <Markdown source={benchmark.readme} linkBase={githubUrl} />
        </div>
      </section>
    </div>
  )
}
