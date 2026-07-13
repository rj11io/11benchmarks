import fs from "node:fs"
import path from "node:path"

export const dynamic = "force-dynamic"

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

export default function Page() {
  const runs = listRuns()

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-6 text-sm leading-relaxed">
        <div>
          <h1 className="font-medium">cv-design-bench</h1>
          <p className="text-muted-foreground">
            Same CV content, same components, different models. Each run
            lives in its own folder under <code>app/</code>. See{" "}
            <code>PROMPT.md</code> to start one.
          </p>
        </div>

        {runs.length === 0 ? (
          <p className="text-muted-foreground">No runs yet.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {runs.map((run) => (
              <li key={run}>
                {/* Plain <a> on purpose: a full page load keeps one run's
                    print/global CSS from leaking into another's. */}
                <a href={`/${run}`} className="font-mono underline underline-offset-4">
                  {run}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
