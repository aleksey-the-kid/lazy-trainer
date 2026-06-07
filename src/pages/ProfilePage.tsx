import { Check, Pencil } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { CalorieBreakdownSheet } from '@/components/profile/CalorieBreakdownSheet'
import { ProfileHistoryTab } from '@/components/profile/ProfileHistoryTab'
import { ProfileMeasurementsTab } from '@/components/profile/ProfileMeasurementsTab'
import { ProfileTabBar, type ProfileTab } from '@/components/profile/ProfileTabBar'
import { UserAvatar } from '@/components/UserAvatar'
import { usePageHeader } from '@/components/layout/PageHeaderContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { User, UserProfile } from '@/db'
import { useI18n } from '@/i18n/context'
import { ACTIVITY_LEVELS } from '@/i18n/translations'
import { getCalorieBreakdown } from '@/lib/calories'
import { ensureProfile, saveProfile } from '@/lib/profile'

interface ProfilePageProps {
  user: User
}

function ProfileField({
  label,
  value,
  editing,
  children,
}: {
  label: string
  value: string
  editing: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground">{label}</Label>
      {editing ? children : <p className="sport-field min-h-10 text-base">{value}</p>}
    </div>
  )
}

export function ProfilePage({ user }: ProfilePageProps) {
  const { t } = useI18n()
  const { setHeaderAction } = usePageHeader()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [draft, setDraft] = useState<UserProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview')
  const [historyKey, setHistoryKey] = useState(0)
  const [calorieSheetOpen, setCalorieSheetOpen] = useState(false)

  useEffect(() => {
    ensureProfile(user).then((loaded) => {
      setProfile(loaded)
      setDraft(loaded)
    })
  }, [user])

  const handleSave = useCallback(async () => {
    if (!draft || !profile) return
    await saveProfile(draft, profile)
    setProfile(draft)
    setEditing(false)
    setHistoryKey((key) => key + 1)
  }, [draft, profile])

  useEffect(() => {
    if (activeTab !== 'overview') {
      setHeaderAction(null)
      return
    }

    setHeaderAction(
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (editing) {
            void handleSave()
          } else {
            setDraft(profile)
            setEditing(true)
          }
        }}
        aria-label={editing ? 'Save profile' : 'Edit profile'}
      >
        {editing ? <Check className="size-5" /> : <Pencil className="size-5" />}
      </Button>,
    )

    return () => setHeaderAction(null)
  }, [activeTab, editing, profile, setHeaderAction, handleSave])

  function handleTabChange(tab: ProfileTab) {
    if (editing && tab !== 'overview') return
    if (editing && tab === 'overview') {
      setDraft(profile)
      setEditing(false)
    }
    setActiveTab(tab)
  }

  if (!profile || !draft) {
    return null
  }

  const data = editing ? draft : profile
  const calorieBreakdown = getCalorieBreakdown(data)
  const dailyCalories = calorieBreakdown?.tdee ?? null
  const notSet = t('profile.notSet')

  function updateDraft(updates: Partial<UserProfile>) {
    setDraft((current) => (current ? { ...current, ...updates } : current))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pb-2">
        {activeTab === 'overview' ? (
          <>
            <div className="flex flex-col items-center gap-3 px-1 pt-1 pb-2">
              <UserAvatar src={user.picture} name={user.name} className="size-24" ring />
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <div className="sport-card space-y-4 p-4">
              <ProfileField
                label={t('profile.dateOfBirth')}
                value={data.dateOfBirth || notSet}
                editing={editing}
              >
                <Input
                  type="date"
                  value={draft.dateOfBirth}
                  onChange={(e) => updateDraft({ dateOfBirth: e.target.value })}
                />
              </ProfileField>

              <div className="space-y-1.5">
                <Label className="text-muted-foreground">{t('profile.sex')}</Label>
                {editing ? (
                  <Select
                    value={draft.sex ?? ''}
                    items={[
                      { value: 'male', label: t('profile.sexMale') },
                      { value: 'female', label: t('profile.sexFemale') },
                    ]}
                    onValueChange={(value) =>
                      updateDraft({
                        sex: value ? (value as UserProfile['sex']) : null,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('profile.notSet')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('profile.sexMale')}</SelectItem>
                      <SelectItem value="female">{t('profile.sexFemale')}</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="sport-field min-h-10 text-base">
                    {data.sex === 'male'
                      ? t('profile.sexMale')
                      : data.sex === 'female'
                        ? t('profile.sexFemale')
                        : notSet}
                  </p>
                )}
              </div>

              <ProfileField
                label={t('profile.height')}
                value={data.heightCm != null ? String(data.heightCm) : notSet}
                editing={editing}
              >
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={draft.heightCm ?? ''}
                  onChange={(e) =>
                    updateDraft({
                      heightCm: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </ProfileField>

              <ProfileField
                label={t('profile.weight')}
                value={data.weightKg != null ? String(data.weightKg) : notSet}
                editing={editing}
              >
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={draft.weightKg ?? ''}
                  onChange={(e) =>
                    updateDraft({
                      weightKg: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </ProfileField>

              <div className="space-y-1.5">
                <Label className="text-muted-foreground">{t('profile.activity')}</Label>
                {editing ? (
                  <Select
                    value={draft.activityLevel}
                    items={ACTIVITY_LEVELS.map((level) => ({
                      value: level,
                      label: t(`activity.${level}`),
                    }))}
                    onValueChange={(value) =>
                      updateDraft({
                        activityLevel: value as UserProfile['activityLevel'],
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {t(`activity.${level}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="sport-field min-h-10 text-base">
                    {t(`activity.${data.activityLevel}`)}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              className="sport-card-accent w-full p-5 text-left transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-100"
              disabled={calorieBreakdown == null}
              onClick={() => calorieBreakdown && setCalorieSheetOpen(true)}
            >
              <p className="text-xs font-medium tracking-widest text-primary uppercase">
                {t('profile.dailyCalories')}
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-primary">
                {dailyCalories != null ? (
                  <>
                    {dailyCalories}
                    <span className="ml-2 text-lg font-semibold text-primary/70">
                      {t('profile.kcal')}
                    </span>
                  </>
                ) : (
                  <span className="text-base font-normal text-muted-foreground">
                    {t('profile.kcalHint')}
                  </span>
                )}
              </p>
              {calorieBreakdown && (
                <p className="mt-2 text-xs text-primary/60">
                  {t('profile.calorieTapHint')}
                </p>
              )}
            </button>

            {calorieBreakdown && (
              <CalorieBreakdownSheet
                open={calorieSheetOpen}
                onOpenChange={setCalorieSheetOpen}
                breakdown={calorieBreakdown}
              />
            )}
          </>
        ) : activeTab === 'history' ? (
          <ProfileHistoryTab
            key={historyKey}
            userId={user.id}
            currentWeight={profile.weightKg}
          />
        ) : (
          <ProfileMeasurementsTab userId={user.id} />
        )}
      </div>

      <ProfileTabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        disabled={editing}
        overviewLabel={t('profile.tabOverview')}
        historyLabel={t('profile.tabHistory')}
        measurementsLabel={t('profile.tabMeasurements')}
      />
    </div>
  )
}
