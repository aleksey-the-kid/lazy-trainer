import type { WeightEntry } from '@/db'
import type { Language } from '@/db'
import { useI18n } from '@/i18n/context'

interface WeightChartProps {
  entries: WeightEntry[]
}

const CHART_WIDTH = 320
const CHART_HEIGHT = 200
const PADDING = { top: 16, right: 12, bottom: 32, left: 36 }

function formatDate(date: string, language: Language): string {
  return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${date}T12:00:00`))
}

function formatWeight(weight: number, language: Language): string {
  return new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
    maximumFractionDigits: 1,
  }).format(weight)
}

export function WeightChart({ entries }: WeightChartProps) {
  const { language } = useI18n()

  if (entries.length === 0) {
    return null
  }

  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom

  const weights = entries.map((entry) => entry.weightKg)
  const minWeight = Math.min(...weights)
  const maxWeight = Math.max(...weights)
  const weightSpan = maxWeight - minWeight || 1
  const yMin = minWeight - weightSpan * 0.15
  const yMax = maxWeight + weightSpan * 0.15
  const yRange = yMax - yMin

  const barWidth = Math.min(28, (plotWidth / entries.length) * 0.65)
  const gap = entries.length > 1 ? plotWidth / (entries.length - 1) : 0

  const bars = entries.map((entry, index) => {
    const x =
      entries.length === 1
        ? PADDING.left + plotWidth / 2
        : PADDING.left + index * gap
    const barHeight = ((entry.weightKg - yMin) / yRange) * plotHeight
    const y = PADDING.top + plotHeight - barHeight

    return { ...entry, x, y, barHeight, barWidth }
  })

  const yTicks = [yMin, yMin + yRange / 2, yMax]
  const xLabelIndices =
    entries.length <= 3
      ? entries.map((_, index) => index)
      : [0, Math.floor((entries.length - 1) / 2), entries.length - 1]

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-hidden
    >
      {yTicks.map((tick) => {
        const y = PADDING.top + plotHeight - ((tick - yMin) / yRange) * plotHeight

        return (
          <g key={tick}>
            <line
              x1={PADDING.left}
              y1={y}
              x2={CHART_WIDTH - PADDING.right}
              y2={y}
              className="stroke-border/50"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 6}
              y={y + 4}
              textAnchor="end"
              className="fill-muted-foreground text-[9px]"
            >
              {formatWeight(tick, language)}
            </text>
          </g>
        )
      })}

      {bars.map((bar, index) => (
        <g key={bar.id}>
          <rect
            x={bar.x - bar.barWidth / 2}
            y={bar.y}
            width={bar.barWidth}
            height={bar.barHeight}
            rx={bar.barWidth / 2}
            fill={index % 2 === 0 ? 'var(--chart-1)' : 'var(--chart-2)'}
            opacity={0.9}
          />
          <circle
            cx={bar.x}
            cy={bar.y}
            r={4}
            fill="var(--foreground)"
            opacity={0.85}
          />
        </g>
      ))}

      {xLabelIndices.map((index) => {
        const bar = bars[index]
        return (
          <text
            key={bar.id}
            x={bar.x}
            y={CHART_HEIGHT - 8}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            {formatDate(bar.date, language)}
          </text>
        )
      })}
    </svg>
  )
}
