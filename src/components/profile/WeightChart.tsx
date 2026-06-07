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

  const points = entries.map((entry, index) => {
    const x =
      entries.length === 1
        ? PADDING.left + plotWidth / 2
        : PADDING.left + (index / (entries.length - 1)) * plotWidth
    const y =
      PADDING.top + plotHeight - ((entry.weightKg - yMin) / yRange) * plotHeight

    return { ...entry, x, y }
  })

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

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
        const y =
          PADDING.top + plotHeight - ((tick - yMin) / yRange) * plotHeight

        return (
          <g key={tick}>
            <line
              x1={PADDING.left}
              y1={y}
              x2={CHART_WIDTH - PADDING.right}
              y2={y}
              className="stroke-border/60"
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

      {points.length > 1 && (
        <path
          d={linePath}
          fill="none"
          className="stroke-primary"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {points.map((point) => (
        <g key={point.id}>
          <circle
            cx={point.x}
            cy={point.y}
            r={5}
            className="fill-primary stroke-background"
            strokeWidth={2}
          />
        </g>
      ))}

      {xLabelIndices.map((index) => {
        const point = points[index]
        return (
          <text
            key={point.id}
            x={point.x}
            y={CHART_HEIGHT - 8}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            {formatDate(point.date, language)}
          </text>
        )
      })}
    </svg>
  )
}
