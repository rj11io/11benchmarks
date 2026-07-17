import fs from "node:fs"
import path from "node:path"

type JsonRecord = Record<string, unknown>

export type SiteNode = JsonRecord & {
  nodeId: string
  nodeType: "root" | "parent" | "benchmark" | "cycle" | "run"
  title: string
  parentId: string | null
  children: string[]
  summary: JsonRecord
  metadataCoverage: JsonRecord
  dataPath?: string
  sourcePath?: string
}

type SiteIndex = {
  nodes: SiteNode[]
  sourceDigest: string
  generatedAt: string
  rootId: string
}

type ReviewData = JsonRecord & {
  benchmark?: JsonRecord
  cycle?: JsonRecord
  lifecycle?: JsonRecord
  judging?: JsonRecord
  accounting?: JsonRecord
  metadataCoverage?: JsonRecord
  runs?: JsonRecord[]
}

export type RunRecord = {
  id: string
  harness: string | null
  model: string | null
  effort: string | null
  status: string | null
  eligible: boolean | null
  auditStatus: string | null
  score: number | null
  rank: number | null
  costUsd: number | null
  tokens: number | null
  cacheHitRate: number | null
  wallTimeMinutes: number | null
  metadataCoverage: JsonRecord
}

export type ScoreEntry = {
  id: string
  rank: number | null
  total: number | null
  dimensions: Record<string, number>
}

export type CycleRecord = {
  id: string
  title: string
  status: string | null
  releaseType: string | null
  publicationSequence: number | null
  sourcePath: string | null
  runCount: number
  scores: ScoreEntry[]
  runs: RunRecord[]
  judging: JsonRecord
  accounting: JsonRecord
  metadataCoverage: JsonRecord
  lifecycle: JsonRecord
}

export type Benchmark = {
  slug: string
  title: string
  objective: string
  skillTags: string[]
  evidenceSurfaces: string[]
  campaignStatus: string | null
  latestCycle: CycleRecord | null
  cycles: CycleRecord[]
  runCount: number
  eligibleRunCount: number | null
  judgeCounts: { total: number; ai: number; human: number }
  totalTokens: number | null
  pricing: string | null
  knownRunCostUsd: number | null
  metadataCoverage: JsonRecord
  githubPath: string
}

export type RepoMeta = { version: string | null; githubUrl: string }

const FALLBACK_GITHUB_URL = "https://github.com/rj11io/11bench"

function repoRoot(): string {
  const candidates = [path.join(process.cwd(), ".."), process.cwd()]
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "v1"))) return candidate
  }
  return candidates[0]
}

function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T
  } catch {
    return null
  }
}

function readSiteIndex(): SiteIndex {
  const candidates = [
    path.join(process.cwd(), "data", "site-index.json"),
    path.join(repoRoot(), "www", "data", "site-index.json"),
  ]
  for (const candidate of candidates) {
    const index = readJson<SiteIndex>(candidate)
    if (index?.nodes) return index
  }
  return { nodes: [], sourceDigest: "", generatedAt: "", rootId: "" }
}

function record(value: unknown): JsonRecord {
  return value && typeof value === "object" ? (value as JsonRecord) : {}
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null
}

function numberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function boolValue(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null
}

function reviewFor(node: SiteNode): ReviewData | null {
  if (!node.dataPath) return null
  return readJson<ReviewData>(path.join(repoRoot(), node.dataPath))
}

function scoreEntries(
  review: ReviewData | null,
  runs: RunRecord[]
): ScoreEntry[] {
  const judging = record(review?.judging)
  const aggregate = record(judging.aggregate)
  const source = array(aggregate.runs).length
    ? array(aggregate.runs)
    : array(judging.runs)
  const scores = source.map((value) => {
    const item = record(value)
    const dimensions = Object.fromEntries(
      Object.entries(record(item.dimensions)).flatMap(([key, value]) => {
        const number = numberValue(value)
        return number == null ? [] : [[key, number]]
      })
    )
    return {
      id:
        stringValue(item.runId) ??
        stringValue(item.anonymizedAs) ??
        "candidate",
      rank: numberValue(item.rank) ?? numberValue(item.holisticMedianRank),
      total: numberValue(item.total),
      dimensions,
    }
  })
  if (scores.length)
    return scores.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
  return runs
    .filter((run) => run.score != null)
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
    .map((run) => ({
      id: run.id,
      rank: run.rank,
      total: run.score,
      dimensions: {},
    }))
}

function runRecords(node: SiteNode, review: ReviewData | null): RunRecord[] {
  const reviewRuns = new Map(
    array(review?.runs).map((value) => {
      const item = record(value)
      const id = stringValue(item.id) ?? stringValue(item.runId) ?? ""
      return [id, item]
    })
  )
  return node.children
    .map((childId) =>
      readSiteIndex().nodes.find((child) => child.nodeId === childId)
    )
    .filter((child): child is SiteNode => Boolean(child))
    .map((child) => {
      const summary = child.summary
      const reviewed = reviewRuns.get(child.title) ?? {}
      const score = record(summary.score)
      const cost = record(summary.cost)
      return {
        id: child.title,
        harness: stringValue(summary.harness),
        model: stringValue(summary.model),
        effort: stringValue(summary.effort),
        status: stringValue(summary.status) ?? stringValue(reviewed.status),
        eligible: boolValue(summary.eligible) ?? boolValue(reviewed.eligible),
        auditStatus: stringValue(record(summary.audit).status),
        score: numberValue(score.total),
        rank: numberValue(score.rank),
        costUsd: numberValue(cost.costUsd),
        tokens:
          numberValue(summary.tokens) ??
          numberValue(record(reviewed.tokens).total),
        cacheHitRate: numberValue(cost.cacheHitRate),
        wallTimeMinutes: numberValue(cost.wallTimeMinutes),
        metadataCoverage: child.metadataCoverage,
      }
    })
}

function cycleFromNode(node: SiteNode): CycleRecord {
  const review = reviewFor(node)
  const cycle = record(review?.cycle)
  const lifecycle = record(review?.lifecycle)
  const judging = record(review?.judging)
  const accounting = record(review?.accounting)
  const runs = runRecords(node, review)
  return {
    id: stringValue(cycle.cycleId) ?? node.title,
    title: node.title,
    status: stringValue(cycle.status),
    releaseType: stringValue(cycle.releaseType),
    publicationSequence: numberValue(cycle.publicationSequence),
    sourcePath: node.dataPath ?? null,
    runCount: runs.length || array(cycle.runIds).length,
    scores: scoreEntries(review, runs),
    runs,
    judging,
    accounting,
    metadataCoverage: review?.metadataCoverage ?? node.metadataCoverage,
    lifecycle,
  }
}

function benchmarkFromNode(node: SiteNode, allNodes: SiteNode[]): Benchmark {
  const cycles = node.children
    .map((id) => allNodes.find((child) => child.nodeId === id))
    .filter((child): child is SiteNode => Boolean(child))
    .map(cycleFromNode)
    .sort((a, b) => (b.publicationSequence ?? 0) - (a.publicationSequence ?? 0))
  const latestCycle = cycles[0] ?? null
  const review = latestCycle
    ? readJson<ReviewData>(path.join(repoRoot(), latestCycle.sourcePath ?? ""))
    : null
  const benchmarkData = record(review?.benchmark)
  const lifecycle = record(review?.lifecycle)
  const metadata = record(review?.metadataCoverage)
  const accounting = latestCycle ? latestCycle.accounting : {}
  const total = record(accounting.total)
  const pricing = record(accounting.pricing)
  const judging = record(review?.judging)
  const judge = record(judging.count)
  const judgeCounts = record(judging.judgeCounts)
  const fallbackRunCount = latestCycle?.runCount ?? 0
  const runCount =
    numberValue(lifecycle.totalRuns) ??
    numberValue(metadata.registeredRunCount) ??
    fallbackRunCount
  const eligibleRunCount =
    numberValue(lifecycle.eligibleRuns) ??
    numberValue(metadata.eligibleRunCount) ??
    null
  const knownRunCostUsd =
    latestCycle?.runs.reduce((sum, run) => sum + (run.costUsd ?? 0), 0) || null
  return {
    slug: node.sourcePath?.split("/").at(-1) ?? node.title,
    title: stringValue(benchmarkData.name) ?? node.title.replace(/-v\d+$/, ""),
    objective:
      stringValue(benchmarkData.objective) ??
      "Benchmark objective unavailable in the published review.",
    skillTags: array(benchmarkData.skillTags).filter(
      (value): value is string => typeof value === "string"
    ),
    evidenceSurfaces: array(
      benchmarkData.evidenceSurfaces ?? record(review?.cycle).evidenceSurfaces
    ).filter((value): value is string => typeof value === "string"),
    campaignStatus: stringValue(lifecycle.campaignStatus),
    latestCycle,
    cycles,
    runCount,
    eligibleRunCount,
    judgeCounts: {
      total: numberValue(judge.total) ?? numberValue(judgeCounts.total) ?? 0,
      ai: numberValue(judge.ai) ?? numberValue(judgeCounts.ai) ?? 0,
      human: numberValue(judge.human) ?? numberValue(judgeCounts.human) ?? 0,
    },
    totalTokens: numberValue(total.tokens),
    pricing: stringValue(pricing.pricing) ?? stringValue(metadata.pricing),
    knownRunCostUsd,
    metadataCoverage: { ...metadata, ...latestCycle?.metadataCoverage },
    githubPath: node.sourcePath ?? `v1/${node.title}`,
  }
}

export function getSiteNodes(): SiteNode[] {
  return readSiteIndex().nodes
}

export function getBenchmarks(): Benchmark[] {
  const nodes = getSiteNodes()
  return nodes
    .filter((node) => node.nodeType === "benchmark")
    .map((node) => benchmarkFromNode(node, nodes))
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function getBenchmark(slug: string): Benchmark | null {
  return getBenchmarks().find((benchmark) => benchmark.slug === slug) ?? null
}

export function getRepoMeta(): RepoMeta {
  const changelog = readJson<{ version?: string }>(
    path.join(repoRoot(), "package.json")
  )
  return { version: changelog?.version ?? null, githubUrl: FALLBACK_GITHUB_URL }
}

export function getRepoPitch(): string {
  return "A public, review-backed catalog of how coding agents solve the same product and design tasks."
}

export type Totals = { benchmarks: number; runs: number; tokens: number }

export function getTotals(): Totals {
  const benchmarks = getBenchmarks()
  return {
    benchmarks: benchmarks.length,
    runs: benchmarks.reduce((sum, benchmark) => sum + benchmark.runCount, 0),
    tokens: benchmarks.reduce(
      (sum, benchmark) => sum + (benchmark.totalTokens ?? 0),
      0
    ),
  }
}

export function formatUsd(value: number | null): string {
  return value == null ? "—" : `$${value.toFixed(2)}`
}

export function formatTokens(value: number | null): string {
  if (value == null) return "—"
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`
  return value.toLocaleString("en-US")
}

export function formatDate(value: string | null): string {
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
