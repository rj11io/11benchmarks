import fs from "node:fs"
import path from "node:path"

export const dynamic = "force-dynamic"

const GITHUB_BASE = "https://github.com/rj11io/11bench/blob/main/v1/cv-design-bench"

type RunCost = {
  costUsd: number
  harness: string
  cacheHitRate: number | null
  wallTimeMinutes: number | null
  ranAt: string | null
}

type Run = {
  id: string
  cost: RunCost | null
}

function listRuns(): string[] {
  const appDir = path.join(process.cwd(), "app")
  return fs
    .readdirSync(appDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) =>
      fs.existsSync(path.join(appDir, entry.name, "page.tsx")),
    )
    .map((entry) => entry.name)
    .sort()
}

/**
 * Measured costs from benchmark/costs/summary.json. Lenient on purpose:
 * a missing or malformed file just means the table shows runs without
 * cost columns.
 */
function loadCosts(): Record<string, RunCost> {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "benchmark", "costs", "summary.json"),
      "utf8",
    )
    const summary = JSON.parse(raw) as {
      runs?: Record<
        string,
        {
          kind?: string
          costUsd?: number
          harness?: string
          cacheHitRate?: number
          wallTimeMinutes?: number | null
          ranAt?: string | null
        }
      >
    }
    const costs: Record<string, RunCost> = {}
    for (const [id, run] of Object.entries(summary.runs ?? {})) {
      if (run.kind !== "benchmark-run") continue
      costs[id] = {
        costUsd: typeof run.costUsd === "number" ? run.costUsd : 0,
        harness: run.harness ?? "unknown",
        cacheHitRate:
          typeof run.cacheHitRate === "number" ? run.cacheHitRate : null,
        wallTimeMinutes:
          typeof run.wallTimeMinutes === "number" ? run.wallTimeMinutes : null,
        ranAt: typeof run.ranAt === "string" ? run.ranAt : null,
      }
    }
    return costs
  } catch {
    return {}
  }
}

function formatUsd(value: number): string {
  return `$${value.toFixed(2)}`
}

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

const HARNESS_LABELS: Record<string, string> = {
  "claude-code": "Claude Code",
  codex: "Codex",
}

export default function Page() {
  const costs = loadCosts()
  const runs: Run[] = listRuns()
    .map((id) => ({ id, cost: costs[id] ?? null }))
    // Most expensive first, like COSTS.md; runs without cost data last.
    .sort((a, b) => {
      if (a.cost && b.cost) return b.cost.costUsd - a.cost.costUsd
      if (a.cost) return -1
      if (b.cost) return 1
      return a.id.localeCompare(b.id)
    })

  const measured = runs.filter(
    (run): run is Run & { cost: RunCost } => run.cost !== null,
  )
  const totalCost = measured.reduce((sum, run) => sum + run.cost.costUsd, 0)
  const maxCost = Math.max(...measured.map((run) => run.cost.costUsd), 0)
  const cheapest = measured[measured.length - 1]
  const priciest = measured[0]
  const spread =
    priciest && cheapest && cheapest.cost.costUsd > 0
      ? Math.round(priciest.cost.costUsd / cheapest.cost.costUsd)
      : null
  const harnesses = [
    ...new Set(measured.map((run) => run.cost.harness)),
  ].sort()

  const stats = [
    { label: "runs", value: String(runs.length) },
    measured.length > 0
      ? { label: "total spend", value: formatUsd(totalCost) }
      : null,
    spread ? { label: "cost spread", value: `${spread}×` } : null,
    harnesses.length > 0
      ? { label: "harnesses", value: String(harnesses.length) }
      : null,
  ].filter((stat): stat is { label: string; value: string } => stat !== null)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header>
        <p className="text-muted-foreground font-mono text-xs">11bench / v1</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          cv-design-bench
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl leading-relaxed">
          Every coding agent below built the same personal CV website from the
          same content, the same components, and the same rules. The only
          variable is the model&apos;s taste — and what it spent getting there.
        </p>
      </header>

      {stats.length > 0 ? (
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card px-4 py-3">
              <dt className="text-muted-foreground font-mono text-[11px]">
                {stat.label}
              </dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <section className="mt-10">
        <h2 className="text-sm font-medium">Runs</h2>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
          Sorted by measured cost. Costs are read from each harness&apos;s own
          session transcripts and priced with cache-aware, per-model rates —
          see{" "}
          <a
            href={`${GITHUB_BASE}/benchmark/costs/COSTS.md`}
            className="underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            COSTS.md
          </a>
          . Judging has not run yet.
        </p>

        {runs.length === 0 ? (
          <p className="text-muted-foreground mt-4 text-sm">No runs yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left font-mono text-[11px] text-muted-foreground">
                  <th className="px-3 py-2 font-medium">run</th>
                  <th className="px-3 py-2 font-medium">harness</th>
                  <th className="px-3 py-2 font-medium">ran</th>
                  <th className="px-3 py-2 text-right font-medium">wall</th>
                  <th className="px-3 py-2 text-right font-medium">cache</th>
                  <th className="px-3 py-2 text-right font-medium">cost</th>
                  <th className="w-24 px-3 py-2" aria-hidden="true" />
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr
                    key={run.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {/* Plain <a> on purpose: a full page load keeps one
                          run's print/global CSS from leaking into another's. */}
                      <a
                        href={`/${run.id}`}
                        className="font-mono text-xs underline underline-offset-4"
                      >
                        {run.id}
                      </a>
                    </td>
                    <td className="text-muted-foreground px-3 py-2.5 text-xs whitespace-nowrap">
                      {run.cost
                        ? (HARNESS_LABELS[run.cost.harness] ?? run.cost.harness)
                        : "—"}
                    </td>
                    <td className="text-muted-foreground px-3 py-2.5 text-xs whitespace-nowrap tabular-nums">
                      {formatDate(run.cost?.ranAt ?? null)}
                    </td>
                    <td className="text-muted-foreground px-3 py-2.5 text-right text-xs whitespace-nowrap tabular-nums">
                      {run.cost?.wallTimeMinutes != null
                        ? `${run.cost.wallTimeMinutes.toFixed(1)} min`
                        : "—"}
                    </td>
                    <td className="text-muted-foreground px-3 py-2.5 text-right text-xs tabular-nums">
                      {run.cost?.cacheHitRate != null
                        ? `${Math.round(run.cost.cacheHitRate * 100)}%`
                        : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs whitespace-nowrap tabular-nums">
                      {run.cost ? formatUsd(run.cost.costUsd) : "—"}
                    </td>
                    <td className="px-3 py-2.5">
                      {run.cost && maxCost > 0 ? (
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-foreground/70"
                            style={{
                              width: `${Math.max((run.cost.costUsd / maxCost) * 100, 2)}%`,
                            }}
                          />
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="text-muted-foreground mt-10 flex flex-col gap-2 border-t border-border pt-6 font-mono text-xs sm:flex-row sm:items-center">
        <p>
          Start a run: see{" "}
          <a
            href={`${GITHUB_BASE}/PROMPT.md`}
            className="underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            PROMPT.md
          </a>
        </p>
        <div className="flex gap-4 sm:ml-auto">
          <a
            href="https://bench.rj11.io/"
            className="underline-offset-4 hover:underline"
          >
            bench.rj11.io
          </a>
          <a
            href="https://github.com/rj11io/11bench/tree/main/v1/cv-design-bench"
            className="underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </footer>

      <p className="text-muted-foreground/70 mt-6 font-mono text-[11px]">
        Press <kbd>d</kbd> to toggle dark mode
      </p>
    </div>
  )
}
