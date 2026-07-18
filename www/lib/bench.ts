import fs from "node:fs"
import path from "node:path"

export type JsonRecord = Record<string, unknown>

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
  gate?: JsonRecord
  judging?: JsonRecord
  accounting?: JsonRecord
  metadataCoverage?: JsonRecord
  publishTargets?: JsonRecord
  limitations?: unknown[]
  provenance?: JsonRecord
  runs?: JsonRecord[]
}

export type TokenBreakdown = {
  total: number | null
  input: number | null
  output: number | null
  reasoning: number | null
  cachedInputRead: number | null
  inputUncached: number | null
}

export type CostBreakdown = {
  totalUsd: number | null
  inputUsd: number | null
  outputUsd: number | null
  cachedInputReadUsd: number | null
  inputUncachedUsd: number | null
  cacheHitRate: number | null
  wallTimeMinutes: number | null
}

export type RunRecord = {
  id: string
  harness: string | null
  harnessVersion: string | null
  model: string | null
  provider: string | null
  effort: string | null
  runRef: string | null
  startedAt: string | null
  finishedAt: string | null
  status: string | null
  eligible: boolean | null
  auditStatus: string | null
  score: number | null
  rank: number | null
  judgeRank: number | null
  scoreDisagreement: number | null
  costUsd: number | null
  tokens: number | null
  cacheHitRate: number | null
  wallTimeMinutes: number | null
  tokenBreakdown: TokenBreakdown
  costBreakdown: CostBreakdown
  metadataCoverage: JsonRecord
  audit: JsonRecord
  metadata: JsonRecord
  raw: JsonRecord
}

export type ScoreEntry = {
  id: string
  anonymizedId: string | null
  rank: number | null
  judgeRank: number | null
  total: number | null
  scoreDisagreement: number | null
  dimensions: Record<string, number>
  dispersion: JsonRecord
}

export type AccountingScope = {
  id: string
  label: string
  threadCount: number | null
  tokens: number | null
  costUsd: number | null
  knownTokenThreads: number | null
  knownCostThreads: number | null
}

export type CycleRecord = {
  id: string
  title: string
  status: string | null
  releaseType: string | null
  publicationSequence: number | null
  previousCycleId: string | null
  sourcePath: string | null
  sourceDigest: string | null
  generatedAt: string | null
  reviewedAt: string | null
  publishedAt: string | null
  runCount: number
  scores: ScoreEntry[]
  runs: RunRecord[]
  judging: JsonRecord
  accounting: JsonRecord
  accountingScopes: AccountingScope[]
  accountingTotal: AccountingScope | null
  metadataCoverage: JsonRecord
  lifecycle: JsonRecord
  coverage: JsonRecord
  gate: JsonRecord
  publishTargets: JsonRecord
  limitations: string[]
  provenance: JsonRecord
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
  totalAccountingCostUsd: number | null
  pricing: string | null
  metadataCoverage: JsonRecord
  providers: string[]
  harnesses: string[]
  models: string[]
  efforts: string[]
  coverage: JsonRecord
  githubPath: string
  sourceDigest: string | null
  generatedAt: string | null
}

export type RepoMeta = {
  version: string | null
  githubUrl: string
  sourceDigest: string
  generatedAt: string
}

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

function projectPath(relativePath: string): string {
  const normalized = relativePath.replace(/^\.\//, "")
  const candidates = [
    path.join(repoRoot(), normalized),
    path.join(repoRoot(), "v1", normalized),
    path.join(process.cwd(), normalized),
    path.join(process.cwd(), "..", normalized),
  ]
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0]
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
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {}
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

function findReview(node: SiteNode): ReviewData | null {
  return node.dataPath
    ? readJson<ReviewData>(projectPath(node.dataPath))
    : null
}

function cycleDirectory(node: SiteNode): string | null {
  if (!node.dataPath) return null
  return path.dirname(path.dirname(projectPath(node.dataPath)))
}

function findMapping(node: SiteNode): JsonRecord {
  const root = cycleDirectory(node)
  return root ? (readJson<JsonRecord>(path.join(root, "judging/mapping.json")) ?? {}) : {}
}

function anonymizedToRunId(node: SiteNode): Map<string, string> {
  const source = findMapping(node)
  const result = new Map<string, string>()
  const objectMapping = record(source.mapping)
  for (const [runId, anonymized] of Object.entries(objectMapping)) {
    if (typeof anonymized === "string") result.set(anonymized, runId)
  }
  for (const key of ["runs", "entries", "mapping"]) {
    for (const value of array(source[key])) {
      const item = record(value)
      const runId = stringValue(item.runId)
      const anonymized = stringValue(item.anonymizedAs)
      if (runId && anonymized) result.set(anonymized, runId)
    }
  }
  return result
}

function scoreSource(review: ReviewData | null): unknown[] {
  const judging = record(review?.judging)
  const aggregate = record(judging.aggregate)
  const aggregateRuns = array(aggregate.runs)
  if (aggregateRuns.length) return aggregateRuns
  const judgedRuns = array(judging.runs)
  if (judgedRuns.length) return judgedRuns
  return array(judging.scoreboard)
}

function scoreEntries(review: ReviewData | null, node: SiteNode): ScoreEntry[] {
  const mapping = anonymizedToRunId(node)
  return scoreSource(review)
    .map((value) => {
      const item = record(value)
      const anonymizedId =
        stringValue(item.anonymizedAs) ?? stringValue(item.candidate)
      const directId = stringValue(item.runId)
      const id = directId ?? (anonymizedId ? mapping.get(anonymizedId) : null)
      const dimensions = Object.fromEntries(
        Object.entries(record(item.dimensions)).flatMap(([key, value]) => {
          const number = numberValue(value)
          return number == null ? [] : [[key, number]]
        })
      )
      return {
        id: id ?? anonymizedId ?? "candidate",
        anonymizedId,
        rank: numberValue(item.rank),
        judgeRank:
          numberValue(item.holisticMedianRank) ?? numberValue(item.holisticRank),
        total: numberValue(item.total) ?? numberValue(item.score),
        scoreDisagreement: numberValue(item.scoreHolisticDisagreement),
        dimensions,
        dispersion: record(item.dispersion),
      }
    })
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
}

function reviewedRunId(value: unknown): string | null {
  const item = record(value)
  return stringValue(item.id) ?? stringValue(record(item.run).id) ?? stringValue(item.runId)
}

function tokenBreakdown(source: JsonRecord): TokenBreakdown {
  const tokens = record(source.tokens)
  const input =
    numberValue(tokens.input) ??
    numberValue(tokens.inputTokens) ??
    numberValue(source.inputTokens)
  const output =
    numberValue(tokens.output) ??
    numberValue(tokens.outputTokens) ??
    numberValue(source.outputTokens)
  return {
    total: numberValue(tokens.total) ?? numberValue(source.tokens),
    input,
    output,
    reasoning:
      numberValue(tokens.reasoning) ??
      numberValue(tokens.reasoningOutput) ??
      numberValue(source.reasoningOutput),
    cachedInputRead:
      numberValue(tokens.cachedInputRead) ?? numberValue(tokens.cacheRead),
    inputUncached:
      numberValue(tokens.inputUncached) ?? numberValue(tokens.uncachedInput),
  }
}

function costBreakdown(source: JsonRecord): CostBreakdown {
  const cost = record(source.cost)
  return {
    totalUsd: numberValue(cost.costUsd) ?? numberValue(source.costUsd),
    inputUsd:
      numberValue(cost.inputUsd) ?? numberValue(cost.inputUncachedUsd),
    outputUsd: numberValue(cost.outputUsd),
    cachedInputReadUsd: numberValue(cost.cachedInputReadUsd),
    inputUncachedUsd: numberValue(cost.inputUncachedUsd),
    cacheHitRate: numberValue(cost.cacheHitRate),
    wallTimeMinutes:
      numberValue(cost.wallTimeMinutes) ?? numberValue(source.wallTimeMinutes),
  }
}

function runRecords(
  node: SiteNode,
  review: ReviewData | null,
  scores: ScoreEntry[]
): RunRecord[] {
  const reviewRuns = new Map(
    array(review?.runs)
      .map((value) => [reviewedRunId(value), record(value)] as const)
      .filter((entry): entry is readonly [string, JsonRecord] => Boolean(entry[0]))
  )
  const scoreByRun = new Map(scores.map((score) => [score.id, score]))
  const index = readSiteIndex()

  return node.children
    .map((childId) => index.nodes.find((child) => child.nodeId === childId))
    .filter((child): child is SiteNode => Boolean(child))
    .map((child) => {
      const summary = record(child.summary)
      const nested = record(summary.run)
      const id = child.title
      const reviewed = reviewRuns.get(id) ?? {}
      const reviewedNested = record(reviewed.run)
      const source = { ...reviewedNested, ...reviewed, ...nested, ...summary }
      const scoreSourceValue = record(source.score)
      const score = scoreByRun.get(id)
      const audit = record(source.audit)
      const tokens = tokenBreakdown(source)
      const costs = costBreakdown(source)
      return {
        id,
        harness: stringValue(source.harness),
        harnessVersion: stringValue(source.harnessVersion),
        model: stringValue(source.model),
        provider: stringValue(source.provider),
        effort: stringValue(source.effort),
        runRef: stringValue(source.runRef),
        startedAt: stringValue(source.startedAt),
        finishedAt: stringValue(source.finishedAt),
        status: stringValue(source.status),
        eligible: boolValue(source.eligible),
        auditStatus: stringValue(audit.status) ?? stringValue(source.auditStatus),
        score: numberValue(scoreSourceValue.total) ?? score?.total ?? null,
        rank: numberValue(scoreSourceValue.rank) ?? score?.rank ?? null,
        judgeRank:
          numberValue(scoreSourceValue.holisticMedianRank) ?? score?.judgeRank ?? null,
        scoreDisagreement:
          numberValue(scoreSourceValue.scoreHolisticDisagreement) ??
          score?.scoreDisagreement ??
          null,
        costUsd: costs.totalUsd,
        tokens: tokens.total,
        cacheHitRate: costs.cacheHitRate,
        wallTimeMinutes: costs.wallTimeMinutes,
        tokenBreakdown: tokens,
        costBreakdown: costs,
        metadataCoverage: child.metadataCoverage,
        audit,
        metadata: record(source.metadata),
        raw: source,
      }
    })
}

function accountingScope(id: string, label: string, value: unknown): AccountingScope {
  const item = record(value)
  return {
    id,
    label,
    threadCount: numberValue(item.threadCount),
    tokens: numberValue(item.tokens),
    costUsd: numberValue(item.costUsd),
    knownTokenThreads: numberValue(item.knownTokenThreads),
    knownCostThreads: numberValue(item.knownCostThreads),
  }
}

function accountingScopes(accounting: JsonRecord): {
  scopes: AccountingScope[]
  total: AccountingScope | null
} {
  const source = record(accounting.scopes)
  const scopes: AccountingScope[] = []
  for (const [id, label] of [
    ["benchmarkScope", "Benchmark scope"],
    ["judgeScope", "Judge scope"],
    ["benchmarkAndJudgeScope", "Benchmark + judge"],
  ] as const) {
    if (Object.keys(record(source[id])).length) scopes.push(accountingScope(id, label, source[id]))
  }
  for (const [label, value] of Object.entries(record(source.identifiedScopes))) {
    scopes.push(accountingScope(`identified-other:${label}`, `Identified other · ${label}`, value))
  }
  if (Object.keys(record(source.nonIdentifiedScope)).length) {
    scopes.push(accountingScope("unidentified", "Unidentified", source.nonIdentifiedScope))
  }
  const total = Object.keys(record(accounting.total)).length
    ? accountingScope("total", "Total discovered work", accounting.total)
    : null
  return { scopes, total }
}

function cycleFromNode(node: SiteNode): CycleRecord {
  const review = findReview(node)
  const cycle = record(review?.cycle)
  const lifecycle = record(review?.lifecycle)
  const judging = record(review?.judging)
  const accounting = record(review?.accounting)
  const scores = scoreEntries(review, node)
  const runs = runRecords(node, review, scores)
  const accountingData = accountingScopes(accounting)
  const coverage = record(cycle.coverageSnapshot)
  const lifecycleCoverage = record(lifecycle.coverage)
  return {
    id: stringValue(cycle.cycleId) ?? node.title,
    title: node.title,
    status: stringValue(cycle.status),
    releaseType: stringValue(cycle.releaseType),
    publicationSequence: numberValue(cycle.publicationSequence),
    previousCycleId: stringValue(cycle.previousCycleId),
    sourcePath: node.dataPath ?? null,
    sourceDigest: stringValue(review?.sourceDigest) ?? stringValue(cycle.sourceDigest),
    generatedAt: stringValue(review?.generatedAt),
    reviewedAt: stringValue(cycle.reviewedAt) ?? stringValue(review?.generatedAt),
    publishedAt: stringValue(cycle.publishedAt),
    runCount: runs.length || array(cycle.runIds).length,
    scores,
    runs,
    judging,
    accounting,
    accountingScopes: accountingData.scopes,
    accountingTotal: accountingData.total,
    metadataCoverage: review?.metadataCoverage ?? node.metadataCoverage,
    lifecycle,
    coverage: Object.keys(coverage).length ? coverage : lifecycleCoverage,
    gate: record(review?.gate),
    publishTargets: record(review?.publishTargets),
    limitations: array(review?.limitations).filter(
      (value): value is string => typeof value === "string"
    ),
    provenance: record(review?.provenance),
  }
}

function benchmarkConfig(node: SiteNode): JsonRecord {
  return node.sourcePath
    ? (readJson<JsonRecord>(projectPath(path.join(node.sourcePath, "benchmark/benchmark.json"))) ?? {})
    : {}
}

function benchmarkFromNode(node: SiteNode, allNodes: SiteNode[]): Benchmark {
  const cycles = node.children
    .map((id) => allNodes.find((child) => child.nodeId === id))
    .filter((child): child is SiteNode => Boolean(child))
    .map(cycleFromNode)
    .sort((a, b) => (b.publicationSequence ?? 0) - (a.publicationSequence ?? 0))
  const latestCycle = cycles[0] ?? null
  const review = latestCycle?.sourcePath
    ? readJson<ReviewData>(projectPath(latestCycle.sourcePath))
    : null
  const benchmarkData = record(review?.benchmark)
  const config = benchmarkConfig(node)
  const lifecycle = record(review?.lifecycle)
  const metadata = record(review?.metadataCoverage)
  const total = latestCycle?.accountingTotal
  const runs = latestCycle?.runs ?? []
  const judgeCounts = record(record(review?.judging).judgeCounts)
  const aggregateJudgeCounts = record(
    record(record(review?.judging).aggregate).judgeCounts
  )
  const runCount =
    numberValue(lifecycle.totalRuns) ??
    numberValue(metadata.registeredRunCount) ??
    latestCycle?.runCount ??
    0
  const eligibleRunCount =
    numberValue(lifecycle.eligibleRuns) ??
    numberValue(record(lifecycle.coverage).complete) ??
    numberValue(metadata.eligibleRunCount) ??
    null
  const sources = {
    ...record(config),
    ...benchmarkData,
  }
  const githubPath = `v1/${node.sourcePath ?? node.title}`.replace(/\\/g, "/")
  return {
    slug: node.sourcePath?.split("/").at(-1) ?? node.title,
    title:
      stringValue(sources.name) ??
      stringValue(sources.title) ??
      node.title.replace(/-v\d+$/, ""),
    objective:
      stringValue(sources.objective) ??
      "Benchmark objective unavailable in the published review.",
    skillTags: array(sources.skillTags).filter(
      (value): value is string => typeof value === "string"
    ),
    evidenceSurfaces: array(sources.evidenceSurfaces).filter(
      (value): value is string => typeof value === "string"
    ),
    campaignStatus: stringValue(lifecycle.campaignStatus),
    latestCycle,
    cycles,
    runCount,
    eligibleRunCount,
    judgeCounts: {
      total:
        numberValue(judgeCounts.total) ??
        numberValue(aggregateJudgeCounts.total) ??
        numberValue(record(review?.judging).judgeCount) ??
        0,
      ai: numberValue(judgeCounts.ai) ?? numberValue(aggregateJudgeCounts.ai) ?? 0,
      human:
        numberValue(judgeCounts.human) ??
        numberValue(aggregateJudgeCounts.human) ??
        0,
    },
    totalTokens: total?.tokens ?? null,
    totalAccountingCostUsd: total?.costUsd ?? null,
    pricing:
      stringValue(record(latestCycle?.accounting).pricing) ??
      stringValue(metadata.pricing),
    metadataCoverage: { ...metadata, ...latestCycle?.metadataCoverage },
    providers: unique(runs.map((run) => run.provider)),
    harnesses: unique(runs.map((run) => run.harness)),
    models: unique(runs.map((run) => run.model)),
    efforts: unique(runs.map((run) => run.effort)),
    coverage: latestCycle?.coverage ?? {},
    githubPath,
    sourceDigest: latestCycle?.sourceDigest ?? null,
    generatedAt: latestCycle?.generatedAt ?? null,
  }
}

function unique(values: Array<string | null>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))].sort()
}

export function getSiteIndexMeta() {
  const index = readSiteIndex()
  return { sourceDigest: index.sourceDigest, generatedAt: index.generatedAt }
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

export function getCycle(slug: string, cycleId: string): CycleRecord | null {
  return getBenchmark(slug)?.cycles.find((cycle) => cycle.id === cycleId) ?? null
}

export function getRun(
  slug: string,
  cycleId: string,
  runId: string
): { benchmark: Benchmark; cycle: CycleRecord; run: RunRecord } | null {
  const benchmark = getBenchmark(slug)
  const cycle = benchmark?.cycles.find((candidate) => candidate.id === cycleId)
  const run = cycle?.runs.find((candidate) => candidate.id === runId)
  return benchmark && cycle && run ? { benchmark, cycle, run } : null
}

export function getRepoMeta(): RepoMeta {
  const packageData = readJson<{ version?: string }>(
    path.join(repoRoot(), "package.json")
  )
  const index = readSiteIndex()
  return {
    version: packageData?.version ?? null,
    githubUrl: FALLBACK_GITHUB_URL,
    sourceDigest: index.sourceDigest,
    generatedAt: index.generatedAt,
  }
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

export function formatInteger(value: number | null): string {
  return value == null ? "—" : Math.round(value).toLocaleString("en-US")
}

export function formatPercent(value: number | null): string {
  return value == null ? "—" : `${(value * 100).toFixed(1)}%`
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

export function humanizeKey(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function formatMaybe(value: unknown): string {
  if (value == null || value === "") return "Unavailable"
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (typeof value === "number") return value.toLocaleString("en-US")
  return String(value)
}
