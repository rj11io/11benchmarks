import { formatTokens, formatUsd, type RunRecord } from "@/lib/bench"

export function RunTable({ runs }: { runs: RunRecord[] }) {
  const maxCost = Math.max(...runs.map((run) => run.costUsd ?? 0), 0)
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            <th className="px-3 py-2.5">Run</th>
            <th className="px-3 py-2.5">Harness / model</th>
            <th className="px-3 py-2.5">Status</th>
            <th className="px-3 py-2.5 text-right">Rank</th>
            <th className="px-3 py-2.5 text-right">Score</th>
            <th className="px-3 py-2.5 text-right">Tokens</th>
            <th className="px-3 py-2.5 text-right">Cost</th>
            <th className="w-24 px-3 py-2.5" aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr
              key={run.id}
              className="border-b border-border/70 last:border-0"
            >
              <td className="px-3 py-2.5 font-mono text-xs whitespace-nowrap">
                {run.id}
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                {[run.harness, run.model, run.effort]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                {run.status ?? "—"}
                {run.auditStatus ? ` · audit ${run.auditStatus}` : ""}
              </td>
              <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                {run.rank ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                {run.score?.toFixed(2) ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums">
                {formatTokens(run.tokens)}
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums">
                {formatUsd(run.costUsd)}
              </td>
              <td className="px-3 py-2.5">
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground/70"
                    style={{
                      width: `${maxCost > 0 && run.costUsd != null ? Math.max((run.costUsd / maxCost) * 100, 2) : 0}%`,
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
