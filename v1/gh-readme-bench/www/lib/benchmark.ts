import fs from "node:fs"
import path from "node:path"

type Data = Record<string, unknown>

export type GhRun = {
  id: string
  status: string
  eligible: boolean | null
  cost: number | null
  tokens: number | null
  audit: string
}

export type GhCycle = {
  id: string
  status: string
  releaseType: string
  publicationSequence: number
  sourcePath: string
  runIds: string[]
  runs: GhRun[]
  scores: Array<{ id: string; rank: number | null; total: number | null }>
  review: Data
}

function record(value: unknown): Data {
  return value && typeof value === "object" ? (value as Data) : {}
}
function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}
function text(value: unknown, fallback = "—"): string {
  return typeof value === "string" && value ? value : fallback
}
function number(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}
function root() {
  return path.join(process.cwd(), "..")
}

function reviewFiles() {
  const cycles = path.join(root(), "benchmark", "cycles")
  if (!fs.existsSync(cycles)) return []
  return fs.readdirSync(cycles).flatMap((cycle) => {
    const file = path.join(cycles, cycle, "review", "data.json")
    if (!fs.existsSync(file)) return []
    try {
      return [
        {
          cycle,
          file,
          data: JSON.parse(fs.readFileSync(file, "utf8")) as Data,
        },
      ]
    } catch {
      return []
    }
  })
}

function cycleFrom(file: { cycle: string; file: string; data: Data }): GhCycle {
  const data = file.data
  const cycle = record(data.cycle)
  const runs = list(data.runs).map((value) => {
    const run = record(value)
    return {
      id: text(run.id, text(run.runId, "unknown-run")),
      status: text(run.status),
      eligible: typeof run.eligible === "boolean" ? run.eligible : null,
      cost: number(record(run.cost).costUsd),
      tokens: number(record(run.tokens).total),
      audit: text(record(run.audit).status, "not reported"),
    }
  })
  const judging = record(data.judging)
  const aggregate = record(judging.aggregate)
  const scores = list(aggregate.runs)
    .map((value) => {
      const score = record(value)
      return {
        id: text(score.runId, text(score.anonymizedAs, "candidate")),
        rank: number(score.rank),
        total: number(score.total),
      }
    })
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
  return {
    id: text(cycle.cycleId, file.cycle),
    status: text(cycle.status),
    releaseType: text(cycle.releaseType),
    publicationSequence: number(cycle.publicationSequence) ?? 0,
    sourcePath: path.relative(root(), file.file),
    runIds: list(cycle.runIds).filter(
      (value): value is string => typeof value === "string"
    ),
    runs,
    scores,
    review: data,
  }
}

export function getCycles() {
  return reviewFiles()
    .map(cycleFrom)
    .sort((a, b) => b.publicationSequence - a.publicationSequence)
}
export function getLatestCycle() {
  return getCycles()[0] ?? null
}
export function getCycle(id: string) {
  return getCycles().find((cycle) => cycle.id === id) ?? null
}

export function getBenchmark() {
  const latest = getLatestCycle()
  const data = record(latest?.review)
  const benchmark = record(data.benchmark)
  const lifecycle = record(data.lifecycle)
  const accounting = record(data.accounting)
  const total = record(accounting.total)
  const pricing = record(accounting.pricing)
  return {
    title: text(benchmark.name, "gh-readme-bench"),
    objective: text(
      benchmark.objective,
      "Create a truthful, captivating GitHub profile README from frozen source PDFs."
    ),
    tags: list(benchmark.skillTags).filter(
      (value): value is string => typeof value === "string"
    ),
    surfaces: list(benchmark.evidenceSurfaces).filter(
      (value): value is string => typeof value === "string"
    ),
    latest,
    cycles: getCycles(),
    campaign: text(lifecycle.campaignStatus),
    runCount: number(lifecycle.totalRuns) ?? latest?.runIds.length ?? 0,
    eligibleCount: number(lifecycle.eligibleRuns),
    tokens: number(total.tokens),
    pricing: text(pricing.pricing),
    matchedCost:
      latest?.runs.reduce((sum, run) => sum + (run.cost ?? 0), 0) || null,
    judges: record(record(data.judging).count),
  }
}

export function formatTokens(value: number | null) {
  return value == null
    ? "—"
    : value >= 1_000_000
      ? `${(value / 1_000_000).toFixed(1)}M`
      : `${Math.round(value / 1_000)}k`
}
export function formatUsd(value: number | null) {
  return value == null ? "—" : `$${value.toFixed(2)}`
}
export function valueOf(data: Data, key: string) {
  return data[key]
}
