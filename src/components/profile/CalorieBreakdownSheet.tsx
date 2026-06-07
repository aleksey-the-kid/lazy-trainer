import type { CalorieBreakdown } from '@/lib/calories'
import { useI18n } from '@/i18n/context'
import { formatTranslation } from '@/i18n/translations'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface CalorieBreakdownSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  breakdown: CalorieBreakdown
}

function ProgressRing({
  value,
  max,
  color,
  label,
  sublabel,
}: {
  value: number
  max: number
  color: string
  label: string
  sublabel: string
}) {
  const size = 88
  const stroke = 8
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / max, 1)
  const offset = circumference * (1 - progress)

  return (
    <div className="sport-card-stat flex flex-col items-center gap-2 p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-lg font-bold">{value}</p>
          <p className="text-[10px] tracking-wide text-muted-foreground uppercase">{sublabel}</p>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export function CalorieBreakdownSheet({
  open,
  onOpenChange,
  breakdown,
}: CalorieBreakdownSheetProps) {
  const { t } = useI18n()

  const sexAdjust =
    breakdown.sex === 'male'
      ? t('profile.calorieSexAdjustMale')
      : t('profile.calorieSexAdjustFemale')

  const bmrLine = formatTranslation(t('profile.calorieFormulaBmr'), {
    weight: breakdown.weightKg,
    height: breakdown.heightCm,
    age: breakdown.age,
    sexAdjust,
    bmr: breakdown.bmr,
  })

  const tdeeLine = formatTranslation(t('profile.calorieFormulaTdee'), {
    bmr: breakdown.bmr,
    multiplier: breakdown.multiplier,
    activity: t(`activity.${breakdown.activityLevel}`),
    tdee: breakdown.tdee,
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="gap-4 rounded-t-3xl px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <SheetHeader className="p-0 text-left">
          <SheetTitle className="text-xl font-bold">{t('profile.calorieFormulaTitle')}</SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <ProgressRing
            value={breakdown.bmr}
            max={breakdown.tdee}
            color="var(--chart-1)"
            label={t('profile.calorieFormulaName')}
            sublabel="BMR"
          />
          <ProgressRing
            value={breakdown.tdee}
            max={breakdown.tdee}
            color="var(--chart-2)"
            label={t('profile.dailyCalories')}
            sublabel="TDEE"
          />
        </div>

        <div className="space-y-4 pt-2">
          <div className="sport-card space-y-3 p-4 font-mono text-sm leading-relaxed">
            <p>{bmrLine}</p>
            <p>{tdeeLine}</p>
          </div>

          <p className="text-sm text-muted-foreground">{t('profile.calorieFormulaNote')}</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
