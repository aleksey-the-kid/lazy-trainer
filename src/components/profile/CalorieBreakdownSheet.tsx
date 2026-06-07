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
      <SheetContent side="bottom" className="gap-4 rounded-t-2xl px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <SheetHeader className="text-left p-0">
          <SheetTitle>{t('profile.calorieFormulaTitle')}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm font-medium text-muted-foreground">
            {t('profile.calorieFormulaName')}
          </p>

          <div className="sport-card space-y-3 p-4 font-mono text-sm leading-relaxed">
            <p>{bmrLine}</p>
            <p>{tdeeLine}</p>
          </div>

          <p className="text-sm text-muted-foreground">
            {t('profile.calorieFormulaNote')}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
