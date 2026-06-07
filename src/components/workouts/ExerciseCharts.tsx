import type { ReactNode } from 'react'

import type { Language } from '@/db'
import type { ExerciseDaySummary } from '@/lib/exercise-chart-data'

const CHART_WIDTH = 320
const CHART_HEIGHT = 168
const PADDING = { top: 14, right: 10, bottom: 28, left: 34 }

interface ChartPoint {
  date: string
  x: number
  y: number
  value: number
}

function formatDate(date: string, language: Language): string {
  return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${date}T12:00:00`))
}

function formatNumber(value: number, language: Language, digits = 0): string {
  return new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
    maximumFractionDigits: digits,
  }).format(value)
}

function buildPoints(
  summaries: ExerciseDaySummary[],
  valueFn: (day: ExerciseDaySummary) => number,
): ChartPoint[] {
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom

  const values = summaries.map(valueFn)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const span = maxValue - minValue || 1
  const yMin = minValue - span * 0.12
  const yMax = maxValue + span * 0.12
  const yRange = yMax - yMin

  return summaries.map((day, index) => {
    const value = valueFn(day)
    const x =
      summaries.length === 1
        ? PADDING.left + plotWidth / 2
        : PADDING.left + (index / (summaries.length - 1)) * plotWidth
    const y =
      PADDING.top + plotHeight - ((value - yMin) / yRange) * plotHeight

    return { date: day.date, x, y, value }
  })
}

function buildTicks(values: number[]): number[] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) return [min]
  return [min, min + (max - min) / 2, max]
}

function linePath(points: ChartPoint[]): string {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
}

function areaPath(points: ChartPoint[]): string {
  if (points.length === 0) return ''

  const baseline = CHART_HEIGHT - PADDING.bottom
  const line = linePath(points)
  const last = points[points.length - 1]
  const first = points[0]

  return `${line} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`
}

function ChartFrame({
  points,
  language,
  yTicks,
  showDots = true,
  children,
}: {
  points: ChartPoint[]
  language: Language
  yTicks: number[]
  showDots?: boolean
  children: ReactNode
}) {
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom
  const values = points.map((point) => point.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const span = maxValue - minValue || 1
  const yMin = minValue - span * 0.12
  const yMax = maxValue + span * 0.12
  const yRange = yMax - yMin

  const xLabelIndices =
    points.length <= 3
      ? points.map((_, index) => index)
      : [0, Math.floor((points.length - 1) / 2), points.length - 1]

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id="exercise-volume-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="exercise-reps-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0.02" />
        </linearGradient>
        <filter id="exercise-dot-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="2"
            floodColor="var(--primary)"
            floodOpacity="0.55"
          />
        </filter>
      </defs>

      {yTicks.map((tick) => {
        const y =
          PADDING.top + plotHeight - ((tick - yMin) / yRange) * plotHeight

        return (
          <g key={tick}>
            <line
              x1={PADDING.left}
              y1={y}
              x2={CHART_WIDTH - PADDING.right}
              y2={y}
              className="stroke-border/50"
              strokeDasharray="3 5"
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 5}
              y={y + 3}
              textAnchor="end"
              className="fill-muted-foreground text-[8px]"
            >
              {formatNumber(tick, language, tick % 1 === 0 ? 0 : 1)}
            </text>
          </g>
        )
      })}

      {children}

      {showDots &&
        points.map((point) => (
          <g key={point.date} filter="url(#exercise-dot-glow)">
            <circle
              cx={point.x}
              cy={point.y}
              r={4.5}
              className="fill-primary stroke-background"
              strokeWidth={2}
            />
          </g>
        ))}

      {xLabelIndices.map((index) => {
        const point = points[index]
        return (
          <text
            key={`${point.date}-label`}
            x={point.x}
            y={CHART_HEIGHT - 6}
            textAnchor="middle"
            className="fill-muted-foreground text-[8px]"
          >
            {formatDate(point.date, language)}
          </text>
        )
      })}
    </svg>
  )
}

interface ExerciseChartsProps {
  summaries: ExerciseDaySummary[]
  language: Language
  weightUnit: string
  labels: {
    prWeight: string
    prVolume: string
    sessions: string
    chartWeight: string
    chartVolume: string
    chartReps: string
  }
}

export function ExerciseCharts({
  summaries,
  language,
  weightUnit,
  labels,
}: ExerciseChartsProps) {
  if (summaries.length === 0) return null

  const weightPoints = buildPoints(summaries, (day) => day.maxWeight)
  const volumePoints = buildPoints(summaries, (day) => day.totalVolume)
  const repsPoints = buildPoints(summaries, (day) => day.repsAtMaxWeight)

  const prWeight = Math.max(...summaries.map((day) => day.maxWeight))
  const prVolume = Math.max(...summaries.map((day) => day.totalVolume))

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="sport-card-accent rounded-xl px-3 py-2.5 text-center">
          <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
            {labels.prWeight}
          </p>
          <p className="text-lg font-bold text-primary">
            {formatNumber(prWeight, language, 1)}
          </p>
          <p className="text-[10px] text-muted-foreground">{weightUnit}</p>
        </div>
        <div className="sport-card rounded-xl px-3 py-2.5 text-center">
          <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
            {labels.prVolume}
          </p>
          <p className="text-lg font-bold text-primary">
            {formatNumber(prVolume, language, 0)}
          </p>
          <p className="text-[10px] text-muted-foreground">{weightUnit}</p>
        </div>
        <div className="sport-card rounded-xl px-3 py-2.5 text-center">
          <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
            {labels.sessions}
          </p>
          <p className="text-lg font-bold text-primary">{summaries.length}</p>
        </div>
      </div>

      <div className="sport-card p-4">
        <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {labels.chartWeight}
        </p>
        <ChartFrame
          points={weightPoints}
          language={language}
          yTicks={buildTicks(weightPoints.map((point) => point.value))}
        >
          {weightPoints.length > 1 && (
            <path
              d={linePath(weightPoints)}
              fill="none"
              className="stroke-primary"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </ChartFrame>
      </div>

      <div className="sport-card p-4">
        <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {labels.chartVolume}
        </p>
        <ChartFrame
          points={volumePoints}
          language={language}
          yTicks={buildTicks(volumePoints.map((point) => point.value))}
        >
          <path d={areaPath(volumePoints)} fill="url(#exercise-volume-gradient)" />
          {volumePoints.length > 1 && (
            <path
              d={linePath(volumePoints)}
              fill="none"
              className="stroke-primary"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.9}
            />
          )}
        </ChartFrame>
      </div>

      <div className="sport-card p-4">
        <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {labels.chartReps}
        </p>
        <ChartFrame
          points={repsPoints}
          language={language}
          yTicks={buildTicks(repsPoints.map((point) => point.value))}
          showDots={false}
        >
          <path d={areaPath(repsPoints)} fill="url(#exercise-reps-gradient)" />
          {repsPoints.length > 1 && (
            <path
              d={linePath(repsPoints)}
              fill="none"
              stroke="var(--chart-2)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {repsPoints.map((point) => (
            <circle
              key={`${point.date}-rep`}
              cx={point.x}
              cy={point.y}
              r={3.5}
              fill="var(--chart-2)"
              stroke="var(--background)"
              strokeWidth={1.5}
            />
          ))}
        </ChartFrame>
      </div>
    </div>
  )
}
