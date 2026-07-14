import { formatDate, formatUsd, type RunCost } from "@/lib/bench"

/**
 * Measured run costs, most expensive first, with a relative cost bar so
 * the spread between runs reads at a glance.
 */
export function RunTable({ runs }: { runs: RunCost[] }) {
  const maxCost = Math.max(...runs.map((run) => run.costUsd), 0)

  return (
    <div className="border-border overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-border bg-muted/50 text-muted-foreground border-b text-left text-xs">
            <th className="px-3 py-2 font-medium">Run</th>
            <th className="px-3 py-2 font-medium">Harness</th>
            <th className="px-3 py-2 font-medium">Ran</th>
            <th className="px-3 py-2 text-right font-medium">Wall</th>
            <th className="px-3 py-2 text-right font-medium">Cache hit</th>
            <th className="px-3 py-2 text-right font-medium">Cost</th>
            <th className="w-24 px-3 py-2" aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id} className="border-border border-b last:border-0">
              <td className="text-foreground px-3 py-2 font-mono text-xs whitespace-nowrap">
                {run.id}
              </td>
              <td className="text-muted-foreground px-3 py-2 whitespace-nowrap">
                {run.harness}
              </td>
              <td className="text-muted-foreground px-3 py-2 whitespace-nowrap">
                {formatDate(run.ranAt)}
              </td>
              <td className="text-muted-foreground px-3 py-2 text-right whitespace-nowrap tabular-nums">
                {run.wallTimeMinutes != null
                  ? `${run.wallTimeMinutes.toFixed(1)} min`
                  : "—"}
              </td>
              <td className="text-muted-foreground px-3 py-2 text-right tabular-nums">
                {run.cacheHitRate != null
                  ? `${Math.round(run.cacheHitRate * 100)}%`
                  : "—"}
              </td>
              <td className="text-foreground px-3 py-2 text-right font-mono text-xs whitespace-nowrap tabular-nums">
                {formatUsd(run.costUsd)}
              </td>
              <td className="px-3 py-2">
                <div className="bg-muted h-1.5 w-20 overflow-hidden rounded-full">
                  <div
                    className="bg-foreground/70 h-full rounded-full"
                    style={{
                      width: `${maxCost > 0 ? Math.max((run.costUsd / maxCost) * 100, 2) : 0}%`,
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
