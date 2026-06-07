import type { BodyMeasurementField } from '@/db'
import { MEASUREMENT_BASELINES, measurementScale } from '@/lib/body-measurements'
import type { BodyMeasurementValues } from '@/lib/body-measurements'
import { cn } from '@/lib/utils'

interface BodyFigureProps {
  measurements: BodyMeasurementValues
  highlight?: BodyMeasurementField | null
  className?: string
}

function scale(field: BodyMeasurementField, measurements: BodyMeasurementValues): number {
  return measurementScale(field, measurements[field])
}

export function BodyFigure({ measurements, highlight, className }: BodyFigureProps) {
  const neck = scale('neckCm', measurements)
  const shoulders = scale('shouldersCm', measurements)
  const chest = scale('chestCm', measurements)
  const waist = scale('waistCm', measurements)
  const hips = scale('hipsCm', measurements)
  const bicep = scale('bicepCm', measurements)
  const forearm = scale('forearmCm', measurements)
  const thigh = scale('thighCm', measurements)
  const abdomen = scale('abdomenCm', measurements)

  const partClass = (field: BodyMeasurementField) =>
    cn(
      'transition-all duration-500 ease-out',
      highlight === field && 'opacity-100',
      highlight && highlight !== field && 'opacity-55',
    )

  return (
    <svg
      viewBox="0 0 200 360"
      className={cn('mx-auto h-auto w-full max-w-[220px]', className)}
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id="bodyFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" className="[stop-color:var(--primary)]" stopOpacity="0.35" />
          <stop offset="100%" className="[stop-color:var(--primary)]" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="bodyStroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" className="[stop-color:var(--primary)]" stopOpacity="0.5" />
          <stop offset="100%" className="[stop-color:var(--primary)]" stopOpacity="0.9" />
        </linearGradient>
        <filter id="bodyGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse
        cx="100"
        cy="34"
        rx={22 * neck ** 0.3}
        ry={24}
        className={cn(partClass('neckCm'), 'fill-primary/20 stroke-primary')}
        strokeWidth="1.5"
        filter="url(#bodyGlow)"
      />

      <g className={partClass('shouldersCm')}>
        <ellipse
          cx="100"
          cy="88"
          rx={46 * shoulders}
          ry={18 * shoulders ** 0.5}
          fill="url(#bodyFill)"
          stroke="url(#bodyStroke)"
          strokeWidth="2"
        />
      </g>

      <g className={partClass('chestCm')}>
        <ellipse
          cx="100"
          cy="118"
          rx={40 * chest}
          ry={22 * chest ** 0.6}
          fill="url(#bodyFill)"
          stroke="url(#bodyStroke)"
          strokeWidth="2"
        />
      </g>

      <g className={partClass('waistCm')}>
        <ellipse
          cx="100"
          cy="158"
          rx={30 * waist}
          ry={18 * waist ** 0.55}
          fill="url(#bodyFill)"
          stroke="url(#bodyStroke)"
          strokeWidth="2"
        />
      </g>

      <g className={partClass('hipsCm')}>
        <ellipse
          cx="100"
          cy="198"
          rx={42 * hips}
          ry={20 * hips ** 0.55}
          fill="url(#bodyFill)"
          stroke="url(#bodyStroke)"
          strokeWidth="2"
        />
      </g>

      <g className={partClass('abdomenCm')}>
        <ellipse
          cx="100"
          cy="178"
          rx={34 * abdomen}
          ry={16 * abdomen ** 0.6}
          className="fill-primary/30 stroke-primary"
          strokeWidth="2"
          strokeDasharray={highlight === 'abdomenCm' ? '0' : '4 3'}
        />
      </g>

      <rect
        x={100 - 8 * neck}
        y="58"
        width={16 * neck}
        height="22"
        rx={6 * neck}
        className={cn(partClass('neckCm'), 'fill-primary/15 stroke-primary/70')}
        strokeWidth="1.5"
      />

      <g className={partClass('bicepCm')}>
        <ellipse cx="38" cy="108" rx={10 * bicep} ry={16 * bicep ** 0.7} fill="url(#bodyFill)" stroke="url(#bodyStroke)" strokeWidth="1.8" />
        <ellipse cx="162" cy="108" rx={10 * bicep} ry={16 * bicep ** 0.7} fill="url(#bodyFill)" stroke="url(#bodyStroke)" strokeWidth="1.8" />
      </g>

      <g className={partClass('forearmCm')}>
        <ellipse cx="32" cy="148" rx={8 * forearm} ry={14 * forearm ** 0.7} fill="url(#bodyFill)" stroke="url(#bodyStroke)" strokeWidth="1.8" />
        <ellipse cx="168" cy="148" rx={8 * forearm} ry={14 * forearm ** 0.7} fill="url(#bodyFill)" stroke="url(#bodyStroke)" strokeWidth="1.8" />
      </g>

      <circle cx="26" cy="178" r={5 * forearm ** 0.8} className="fill-primary/25 stroke-primary/60" strokeWidth="1.2" />
      <circle cx="174" cy="178" r={5 * forearm ** 0.8} className="fill-primary/25 stroke-primary/60" strokeWidth="1.2" />

      <g className={partClass('thighCm')}>
        <ellipse cx="78" cy="248" rx={14 * thigh} ry={28 * thigh ** 0.55} fill="url(#bodyFill)" stroke="url(#bodyStroke)" strokeWidth="2" />
        <ellipse cx="122" cy="248" rx={14 * thigh} ry={28 * thigh ** 0.55} fill="url(#bodyFill)" stroke="url(#bodyStroke)" strokeWidth="2" />
      </g>

      <ellipse cx="78" cy="308" rx={10 * thigh ** 0.75} ry={22} fill="url(#bodyFill)" stroke="url(#bodyStroke)" strokeWidth="1.8" />
      <ellipse cx="122" cy="308" rx={10 * thigh ** 0.75} ry={22} fill="url(#bodyFill)" stroke="url(#bodyStroke)" strokeWidth="1.8" />

      <ellipse cx="78" cy="342" rx={8} ry={5} className="fill-primary/20 stroke-primary/50" strokeWidth="1.2" />
      <ellipse cx="122" cy="342" rx={8} ry={5} className="fill-primary/20 stroke-primary/50" strokeWidth="1.2" />

      {highlight && measurements[highlight] != null && (
        <text
          x="100"
          y="356"
          textAnchor="middle"
          className="fill-primary text-[10px] font-medium"
        >
          {measurements[highlight]} cm
        </text>
      )}
    </svg>
  )
}

export { MEASUREMENT_BASELINES }
