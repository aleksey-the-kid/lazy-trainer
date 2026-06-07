import { Check } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { BodyFigure } from '@/components/profile/BodyFigure'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  BODY_MEASUREMENT_FIELDS,
  type BodyMeasurementEntry,
  type BodyMeasurementField,
} from '@/db'
import { useI18n } from '@/i18n/context'
import type { TranslationKey } from '@/i18n/translations'
import {
  emptyMeasurementValues,
  getBodyMeasurementHistory,
  hasAnyMeasurement,
  measurementTodayDateString,
  saveBodyMeasurement,
  type BodyMeasurementValues,
} from '@/lib/body-measurements'

interface ProfileMeasurementsTabProps {
  userId: string
}

const FIELD_LABEL_KEYS: Record<BodyMeasurementField, `profile.measure.${BodyMeasurementField}`> = {
  neckCm: 'profile.measure.neckCm',
  shouldersCm: 'profile.measure.shouldersCm',
  chestCm: 'profile.measure.chestCm',
  waistCm: 'profile.measure.waistCm',
  hipsCm: 'profile.measure.hipsCm',
  bicepCm: 'profile.measure.bicepCm',
  forearmCm: 'profile.measure.forearmCm',
  thighCm: 'profile.measure.thighCm',
  abdomenCm: 'profile.measure.abdomenCm',
}

function valuesFromEntry(entry: BodyMeasurementEntry): BodyMeasurementValues {
  return {
    neckCm: entry.neckCm,
    shouldersCm: entry.shouldersCm,
    chestCm: entry.chestCm,
    waistCm: entry.waistCm,
    hipsCm: entry.hipsCm,
    bicepCm: entry.bicepCm,
    forearmCm: entry.forearmCm,
    thighCm: entry.thighCm,
    abdomenCm: entry.abdomenCm,
  }
}

function formatEntrySummary(
  entry: BodyMeasurementEntry,
  t: (key: TranslationKey) => string,
): string {
  const parts = BODY_MEASUREMENT_FIELDS.filter((field) => entry[field] != null).map(
    (field) => `${t(FIELD_LABEL_KEYS[field])}: ${entry[field]}`,
  )
  return parts.join(' · ')
}

export function ProfileMeasurementsTab({ userId }: ProfileMeasurementsTabProps) {
  const { t, language } = useI18n()
  const [entries, setEntries] = useState<BodyMeasurementEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [date, setDate] = useState(measurementTodayDateString())
  const [values, setValues] = useState<BodyMeasurementValues>(emptyMeasurementValues())
  const [focusedField, setFocusedField] = useState<BodyMeasurementField | null>(null)

  const loadHistory = useCallback(async () => {
    setLoading(true)
    try {
      const history = await getBodyMeasurementHistory(userId)
      setEntries(history)
      const latest = history.at(-1)
      if (latest) {
        setValues(valuesFromEntry(latest))
        setDate(latest.date)
      } else {
        setValues(emptyMeasurementValues())
        setDate(measurementTodayDateString())
      }
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  async function handleSave() {
    if (!hasAnyMeasurement(values)) return

    setSaving(true)
    try {
      await saveBodyMeasurement(userId, date, values)
      await loadHistory()
    } finally {
      setSaving(false)
    }
  }

  function updateField(field: BodyMeasurementField, raw: string) {
    setValues((current) => ({
      ...current,
      [field]: raw ? Number(raw) : null,
    }))
  }

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t('common.loading')}
      </p>
    )
  }

  const canSave = hasAnyMeasurement(values)

  return (
    <div className="space-y-4">
      <div className="sport-card-accent overflow-hidden p-4">
        <p className="mb-1 text-center text-xs font-medium tracking-widest text-primary uppercase">
          {t('profile.measurePreview')}
        </p>
        <BodyFigure measurements={values} highlight={focusedField} />
      </div>

      <div className="sport-card space-y-4 p-4">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground">{t('profile.measureDate')}</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {BODY_MEASUREMENT_FIELDS.map((field) => (
            <div key={field} className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                {t(FIELD_LABEL_KEYS[field])}
              </Label>
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                placeholder="—"
                value={values[field] ?? ''}
                onFocus={() => setFocusedField(field)}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => updateField(field, e.target.value)}
              />
            </div>
          ))}
        </div>

        <Button
          className="w-full"
          disabled={!canSave || saving}
          onClick={() => void handleSave()}
        >
          <Check className="size-4" />
          {saving ? t('common.loading') : t('profile.measureSave')}
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="sport-card flex min-h-32 flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="text-sm text-muted-foreground">{t('profile.measureEmpty')}</p>
        </div>
      ) : (
        <div className="sport-card overflow-hidden">
          <div className="border-b border-border/60 px-4 py-3">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {t('profile.measureHistory')}
            </p>
          </div>
          <ul className="divide-y divide-border/60">
            {[...entries].reverse().map((entry) => (
              <li key={entry.id} className="space-y-1 px-4 py-3">
                <p className="text-sm font-medium text-foreground">
                  {new Intl.DateTimeFormat(
                    language === 'ru' ? 'ru-RU' : 'en-US',
                    { day: 'numeric', month: 'long', year: 'numeric' },
                  ).format(new Date(`${entry.date}T12:00:00`))}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {formatEntrySummary(entry, t)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
