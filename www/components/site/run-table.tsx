import Link from "next/link"

import {
  formatInteger,
  formatPercent,
  formatTokens,
  formatUsd,
  type RunRecord,
} from "@/lib/bench"

export function RunTable({
  runs,
  benchmarkSlug,
  cycleId,
}: {
  runs: RunRecord[]
  benchmarkSlug?: string
  cycleId?: string
}) {
  const maxCost = Math.max(...runs.map((run) => run.costUsd ?? 0), 0)
  if (!runs.length) {
    return <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Run records unavailable in this reviewed cycle.</div>
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[1180px] text-sm">
        <caption className="sr-only">Read-only benchmark run records with quality, cost, token, and provenance fields.</caption>
        <thead>
          <tr className="border-b border-border bg-muted text-left font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase md:sticky md:top-0 md:z-[1]">
            <th scope="col" className="px-3 py-2.5">Run</th>
            <th scope="col" className="px-3 py-2.5">Provider / model</th>
            <th scope="col" className="px-3 py-2.5">Harness · effort</th>
            <th scope="col" className="px-3 py-2.5">Status / audit</th>
            <th scope="col" className="px-3 py-2.5 text-right">Rank</th>
            <th scope="col" className="px-3 py-2.5 text-right">Score</th>
            <th scope="col" className="px-3 py-2.5 text-right">Tokens</th>
            <th scope="col" className="px-3 py-2.5 text-right">Cache</th>
            <th scope="col" className="px-3 py-2.5 text-right">Wall time</th>
            <th scope="col" className="px-3 py-2.5 text-right">Cost</th>
            <th scope="col" className="w-28 px-3 py-2.5" aria-label="Cost scale" />
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => {
            const href = benchmarkSlug && cycleId
              ? `/benchmarks/${benchmarkSlug}/cycles/${cycleId}/runs/${encodeURIComponent(run.id)}`
              : null
            return (
              <tr key={run.id} className="border-b border-border/70 last:border-0 hover:bg-muted/30">
                <td className="px-3 py-2.5 font-mono text-xs whitespace-nowrap">
                  {href ? <Link href={href} className="hover:underline underline-offset-4">{run.id}</Link> : run.id}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span>{run.provider ?? "Unavailable"}</span>
                  <span className="block text-xs text-muted-foreground">{run.model ?? "Unavailable"}</span>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                  {[run.harness, run.effort].filter(Boolean).join(" · ") || "Unavailable"}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                  <span>{run.status ?? "Unavailable"}</span>
                  <span className="block">audit {run.auditStatus ?? "Unavailable"}</span>
                </td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums">{run.rank ?? "Unavailable"}</td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{run.score?.toFixed(2) ?? "Unavailable"}</td>
                <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums">{run.tokens == null ? "Unavailable" : formatTokens(run.tokens)}</td>
                <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums">{formatPercent(run.cacheHitRate)}</td>
                <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums">{run.wallTimeMinutes == null ? "Unavailable" : `${run.wallTimeMinutes.toFixed(1)}m`}</td>
                <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums">{formatUsd(run.costUsd)}</td>
                <td className="px-3 py-2.5">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <div className="h-full rounded-full bg-foreground/70" style={{ width: `${maxCost > 0 && run.costUsd != null ? Math.max((run.costUsd / maxCost) * 100, 2) : 0}%` }} />
                  </div>
                  <span className="sr-only">Cost scale {formatInteger(run.costUsd)}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
