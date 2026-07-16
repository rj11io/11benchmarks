import fs from "node:fs"
import path from "node:path"

export const dynamic = "force-dynamic"

const expectedArtifacts = ["research.md", "prd.md", "design.md"] as const

function listRuns() {
  const appDir = path.join(process.cwd(), "app")

  return fs
    .readdirSync(appDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter(
      (entry) => !entry.name.startsWith("_") && !entry.name.startsWith("(")
    )
    .filter((entry) => fs.existsSync(path.join(appDir, entry.name, "page.tsx")))
    .map((entry) => ({
      id: entry.name,
      artifacts: expectedArtifacts.filter((artifact) =>
        fs.existsSync(path.join(appDir, entry.name, artifact))
      ),
    }))
    .sort((a, b) => a.id.localeCompare(b.id))
}

export default function Page() {
  const runs = listRuns()

  return (
    <main className="min-h-svh bg-background px-5 py-12 text-foreground sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <header className="border-b border-border pb-8">
          <p className="font-mono text-xs text-muted-foreground">
            11bench / clean suite
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            cyber-dashboard-bench
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Research the market, define a credible product, document the system,
            and build the frontend. Every stage remains available for judging.
          </p>
        </header>

        <section className="py-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium">Runs</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Completed routes and their required process artifacts.
              </p>
            </div>
            <span className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground">
              {runs.length}
            </span>
          </div>

          {runs.length === 0 ? (
            <div className="mt-5 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
              No runs yet. Prepare a frozen prompt and ledger entry before
              launching an agent.
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {runs.map((run) => (
                <li
                  key={run.id}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a
                      href={`/${run.id}`}
                      className="font-mono text-sm font-medium underline underline-offset-4"
                    >
                      {run.id}
                    </a>
                    <div className="flex flex-wrap gap-1.5 sm:ml-auto">
                      {expectedArtifacts.map((artifact) => (
                        <span
                          key={artifact}
                          className={
                            run.artifacts.includes(artifact)
                              ? "rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px]"
                              : "rounded border border-dashed border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                          }
                        >
                          {artifact}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
