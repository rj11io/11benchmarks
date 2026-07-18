"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

type QualityPoint = {
  id: string
  score: number
  rank: number | null
  judgeRank: number | null
}

type TradeoffPoint = QualityPoint & {
  cost: number
  tokens: number | null
}

const qualityConfig = {
  score: { label: "Score", color: "var(--color-chart-2)" },
} satisfies ChartConfig

const tradeoffConfig = {
  score: { label: "Score", color: "var(--color-chart-2)" },
} satisfies ChartConfig

function shortLabel(value: string): string {
  return value.length > 22 ? `${value.slice(0, 20)}…` : value
}

function QualityTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload?: QualityPoint }>
}) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null
  return (
    <div className="grid gap-1 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-medium">{point.id}</p>
      <p className="text-muted-foreground">
        Score <span className="font-mono text-foreground">{point.score.toFixed(2)}</span>
      </p>
      <p className="text-muted-foreground">
        Rank <span className="font-mono text-foreground">{point.rank ?? "Unavailable"}</span>
        {point.judgeRank != null ? ` · judge median ${point.judgeRank}` : ""}
      </p>
    </div>
  )
}

function TradeoffTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload?: TradeoffPoint }>
}) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null
  return (
    <div className="grid gap-1 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-medium">{point.id}</p>
      <p className="text-muted-foreground">
        Score <span className="font-mono text-foreground">{point.score.toFixed(2)}</span>
      </p>
      <p className="text-muted-foreground">
        Cost <span className="font-mono text-foreground">${point.cost.toFixed(2)}</span>
      </p>
      <p className="text-muted-foreground">
        Tokens <span className="font-mono text-foreground">{point.tokens?.toLocaleString() ?? "Unavailable"}</span>
      </p>
    </div>
  )
}

export function QualityChart({ points }: { points: QualityPoint[] }) {
  if (!points.length) {
    return <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">Score data unavailable in this reviewed cycle.</div>
  }
  const chartData = points.map((point) => ({ ...point, label: shortLabel(point.id) }))
  return (
    <ChartContainer config={qualityConfig} className="w-full aspect-auto" style={{ height: Math.max(260, points.length * 27) }}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 18, bottom: 4, left: 8 }} accessibilityLayer>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" domain={[0, 10]} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis dataKey="label" type="category" width={108} tickLine={false} axisLine={false} tickMargin={8} />
        <Tooltip cursor={{ fill: "var(--color-muted)" }} content={<QualityTooltip />} />
        <Bar dataKey="score" radius={3} maxBarSize={16}>
          {chartData.map((point, index) => <Cell key={`${point.id}-${index}`} fill={index === 0 ? "var(--color-chart-4)" : "var(--color-chart-2)"} />)}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export function CostQualityChart({ points }: { points: TradeoffPoint[] }) {
  if (!points.length) {
    return <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">Comparable cost and score pairs are unavailable.</div>
  }
  return (
    <ChartContainer config={tradeoffConfig} className="h-72 w-full aspect-auto">
      <ScatterChart margin={{ top: 16, right: 18, bottom: 12, left: 0 }} accessibilityLayer>
        <CartesianGrid />
        <XAxis type="number" dataKey="cost" name="Cost" unit=" USD" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis type="number" dataKey="score" name="Score" domain={[0, 10]} tickLine={false} axisLine={false} tickMargin={8} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<TradeoffTooltip />} />
        <Scatter data={points} fill="var(--color-chart-2)" />
      </ScatterChart>
    </ChartContainer>
  )
}
