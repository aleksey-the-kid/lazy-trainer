import type { ActivityLevel, CardioEquipment, Language } from '@/db'

export type TranslationKey =
  | 'app.name'
  | 'nav.profile'
  | 'nav.workouts'
  | 'nav.settings'
  | 'nav.console'
  | 'nav.signOut'
  | 'login.title'
  | 'login.subtitle'
  | 'login.missingClientId'
  | 'login.failed'
  | 'profile.title'
  | 'profile.firstName'
  | 'profile.lastName'
  | 'profile.dateOfBirth'
  | 'profile.sex'
  | 'profile.sexMale'
  | 'profile.sexFemale'
  | 'profile.height'
  | 'profile.weight'
  | 'profile.activity'
  | 'profile.dailyCalories'
  | 'profile.notSet'
  | 'profile.kcal'
  | 'profile.kcalHint'
  | 'profile.calorieFormulaTitle'
  | 'profile.calorieFormulaName'
  | 'profile.calorieFormulaBmr'
  | 'profile.calorieFormulaTdee'
  | 'profile.calorieFormulaNote'
  | 'profile.calorieSexAdjustMale'
  | 'profile.calorieSexAdjustFemale'
  | 'profile.calorieTapHint'
  | 'profile.tabOverview'
  | 'profile.tabHistory'
  | 'profile.tabMeasurements'
  | 'profile.historyEmpty'
  | 'profile.weightChart'
  | 'profile.historyList'
  | 'profile.weightUnit'
  | 'profile.measurePreview'
  | 'profile.measureDate'
  | 'profile.measureSave'
  | 'profile.measureEmpty'
  | 'profile.measureHistory'
  | 'profile.measure.neckCm'
  | 'profile.measure.shouldersCm'
  | 'profile.measure.chestCm'
  | 'profile.measure.waistCm'
  | 'profile.measure.hipsCm'
  | 'profile.measure.bicepCm'
  | 'profile.measure.forearmCm'
  | 'profile.measure.thighCm'
  | 'profile.measure.abdomenCm'
  | 'workouts.title'
  | 'workouts.empty'
  | 'workouts.tabTemplates'
  | 'workouts.tabExercises'
  | 'workouts.tabHistory'
  | 'workouts.newWorkout'
  | 'workouts.editWorkout'
  | 'workouts.workoutName'
  | 'workouts.exerciseName'
  | 'workouts.addExercise'
  | 'workouts.addSet'
  | 'workouts.set'
  | 'workouts.weight'
  | 'workouts.reps'
  | 'workouts.save'
  | 'workouts.cancel'
  | 'workouts.delete'
  | 'workouts.start'
  | 'workouts.edit'
  | 'workouts.active'
  | 'workouts.continue'
  | 'workouts.complete'
  | 'workouts.exercisesCount'
  | 'workouts.setsCount'
  | 'workouts.selectExercise'
  | 'workouts.exerciseHistoryEmpty'
  | 'workouts.exerciseHistoryList'
  | 'workouts.exerciseDayMaxWeight'
  | 'workouts.exercisePrWeight'
  | 'workouts.exercisePrVolume'
  | 'workouts.exerciseSessions'
  | 'workouts.exerciseChartWeight'
  | 'workouts.exerciseChartVolume'
  | 'workouts.exerciseChartReps'
  | 'workouts.workoutHistoryEmpty'
  | 'workouts.totalVolume'
  | 'workouts.activeSessionExists'
  | 'workouts.removeExercise'
  | 'workouts.removeSet'
  | 'workouts.back'
  | 'workouts.type'
  | 'workouts.typeStrength'
  | 'workouts.typeCardio'
  | 'workouts.duration'
  | 'workouts.minutes'
  | 'workouts.cardioEquipment'
  | 'workouts.cardioDone'
  | 'workouts.doubleStats'
  | 'workouts.doubleStatsHint'
  | 'workouts.toFailure'
  | 'workouts.toFailureHint'
  | 'workouts.failureRepsTitle'
  | 'workouts.failureRepsConfirm'
  | 'workouts.failureRepsActual'
  | 'workouts.historyDetailEmpty'
  | 'workouts.noteTitle'
  | 'workouts.notePlaceholder'
  | 'workouts.noteSave'
  | 'workouts.historyNote'
  | 'settings.title'
  | 'settings.language'
  | 'settings.account'
  | 'settings.languageEn'
  | 'settings.languageRu'
  | 'settings.workoutData'
  | 'settings.workoutDataHint'
  | 'settings.exportWorkouts'
  | 'settings.importWorkouts'
  | 'settings.exporting'
  | 'settings.importing'
  | 'settings.exportSuccess'
  | 'settings.exportError'
  | 'settings.importConfirm'
  | 'settings.importSuccess'
  | 'settings.importInvalid'
  | 'settings.importError'
  | 'settings.updateToast'
  | 'settings.updateAvailable'
  | 'settings.updateApp'
  | 'settings.checkForUpdates'
  | 'settings.reloadApp'
  | 'settings.upToDate'
  | 'settings.appVersion'
  | 'settings.appUpdates'
  | 'settings.changelog'
  | 'settings.showChangelog'
  | 'settings.hideChangelog'
  | 'settings.cloudSync'
  | 'settings.cloudSyncHint'
  | 'settings.syncToDb'
  | 'settings.syncing'
  | 'settings.syncSuccess'
  | 'settings.syncError'
  | 'console.title'
  | 'console.empty'
  | 'console.hint'
  | 'console.clear'
  | 'console.copy'
  | 'console.copySuccess'
  | 'console.count'
  | 'common.loading'
  | 'common.welcomeBack'
  | `activity.${ActivityLevel}`
  | `workouts.equipment.${CardioEquipment}`

const en: Record<TranslationKey, string> = {
  'app.name': 'Lazy Trainer',
  'nav.profile': 'Profile',
  'nav.workouts': 'Workouts',
  'nav.settings': 'Settings',
  'nav.console': 'Console',
  'nav.signOut': 'Sign out',
  'login.title': 'Lazy Trainer',
  'login.subtitle': 'Sign in to sync your training data locally.',
  'login.missingClientId':
    'Missing VITE_GOOGLE_CLIENT_ID. Copy .env.example to .env and follow docs/GOOGLE_LOGIN.md.',
  'login.failed': 'Google sign-in failed. Try again.',
  'profile.title': 'Profile',
  'profile.firstName': 'First name',
  'profile.lastName': 'Last name',
  'profile.dateOfBirth': 'Date of birth',
  'profile.sex': 'Sex',
  'profile.sexMale': 'Male',
  'profile.sexFemale': 'Female',
  'profile.height': 'Height (cm)',
  'profile.weight': 'Weight (kg)',
  'profile.activity': 'Activity level',
  'profile.dailyCalories': 'Daily calories',
  'profile.notSet': 'Not set',
  'profile.kcal': 'kcal',
  'profile.kcalHint': 'Fill in all fields to calculate',
  'profile.calorieFormulaTitle': 'Calorie calculation',
  'profile.calorieFormulaName': 'Mifflin-St Jeor equation',
  'profile.calorieFormulaBmr':
    'BMR = 10 × {weight} + 6.25 × {height} − 5 × {age} {sexAdjust} = {bmr} kcal',
  'profile.calorieFormulaTdee':
    'TDEE = {bmr} × {multiplier} ({activity}) = {tdee} kcal',
  'profile.calorieFormulaNote':
    'This is your estimated daily maintenance calories. Higher body weight increases BMR — that is why the result can look high.',
  'profile.calorieSexAdjustMale': '+ 5',
  'profile.calorieSexAdjustFemale': '− 161',
  'profile.calorieTapHint': 'Tap to see the formula',
  'profile.tabOverview': 'Profile',
  'profile.tabHistory': 'History',
  'profile.tabMeasurements': 'Measurements',
  'profile.historyEmpty': 'Update your weight to start tracking progress.',
  'profile.weightChart': 'Weight trend',
  'profile.historyList': 'Entries',
  'profile.weightUnit': 'kg',
  'profile.measurePreview': 'Body map',
  'profile.measureDate': 'Date',
  'profile.measureSave': 'Save measurements',
  'profile.measureEmpty': 'Enter your first measurements to track progress.',
  'profile.measureHistory': 'History',
  'profile.measure.neckCm': 'Neck',
  'profile.measure.shouldersCm': 'Shoulders',
  'profile.measure.chestCm': 'Chest',
  'profile.measure.waistCm': 'Waist',
  'profile.measure.hipsCm': 'Hips',
  'profile.measure.bicepCm': 'Bicep',
  'profile.measure.forearmCm': 'Forearm',
  'profile.measure.thighCm': 'Thigh',
  'profile.measure.abdomenCm': 'Abdomen',
  'workouts.title': 'Workouts',
  'workouts.empty': 'Create your first workout template.',
  'workouts.tabTemplates': 'Workouts',
  'workouts.tabExercises': 'Exercises',
  'workouts.tabHistory': 'History',
  'workouts.newWorkout': 'New workout',
  'workouts.editWorkout': 'Edit workout',
  'workouts.workoutName': 'Workout name',
  'workouts.exerciseName': 'Exercise name',
  'workouts.addExercise': 'Add exercise',
  'workouts.addSet': 'Add set',
  'workouts.set': 'Set',
  'workouts.weight': 'Weight (kg)',
  'workouts.reps': 'Reps',
  'workouts.save': 'Save',
  'workouts.cancel': 'Cancel',
  'workouts.delete': 'Delete',
  'workouts.start': 'Start',
  'workouts.edit': 'Edit',
  'workouts.active': 'In progress',
  'workouts.continue': 'Continue',
  'workouts.complete': 'Finish workout',
  'workouts.exercisesCount': '{count} exercises',
  'workouts.setsCount': '{count} sets',
  'workouts.selectExercise': 'Select exercise',
  'workouts.exerciseHistoryEmpty': 'Complete workouts to see exercise history.',
  'workouts.exerciseHistoryList': 'Set history',
  'workouts.exerciseDayMaxWeight': 'max {weight} {unit}',
  'workouts.exercisePrWeight': 'Max weight',
  'workouts.exercisePrVolume': 'Max volume',
  'workouts.exerciseSessions': 'Workouts',
  'workouts.exerciseChartWeight': 'Weight progress',
  'workouts.exerciseChartVolume': 'Volume per workout',
  'workouts.exerciseChartReps': 'Reps at max weight',
  'workouts.workoutHistoryEmpty': 'Completed workouts will appear here.',
  'workouts.totalVolume': 'Total volume',
  'workouts.activeSessionExists': 'Finish the current workout before starting a new one.',
  'workouts.removeExercise': 'Remove exercise',
  'workouts.removeSet': 'Remove set',
  'workouts.back': 'Back',
  'workouts.type': 'Workout type',
  'workouts.typeStrength': 'Strength',
  'workouts.typeCardio': 'Cardio',
  'workouts.duration': 'Duration (min)',
  'workouts.minutes': 'min',
  'workouts.cardioEquipment': 'Equipment',
  'workouts.cardioDone': 'Workout completed',
  'workouts.doubleStats': 'Count both arms in stats',
  'workouts.doubleStatsHint': 'Reps are per arm; volume totals count both arms.',
  'workouts.toFailure': 'To failure',
  'workouts.toFailureHint': 'Enter how many reps you achieved to failure.',
  'workouts.failureRepsTitle': 'Actual reps',
  'workouts.failureRepsConfirm': 'Save and finish',
  'workouts.failureRepsActual': 'Reps achieved',
  'workouts.historyDetailEmpty': 'No exercise details for this workout.',
  'workouts.noteTitle': 'Workout note',
  'workouts.notePlaceholder': 'How did it go? Optional.',
  'workouts.noteSave': 'Save and finish',
  'workouts.historyNote': 'Note',
  'workouts.equipment.bike': 'Exercise bike',
  'workouts.equipment.treadmill': 'Treadmill',
  'workouts.equipment.elliptical': 'Elliptical',
  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.account': 'Account',
  'settings.languageEn': 'English',
  'settings.languageRu': 'Russian',
  'settings.workoutData': 'Workout data',
  'settings.workoutDataHint':
    'Export or import templates, exercises, sessions, and workout history. Profile and weight are not included.',
  'settings.exportWorkouts': 'Export',
  'settings.importWorkouts': 'Import',
  'settings.exporting': 'Exporting…',
  'settings.importing': 'Importing…',
  'settings.exportSuccess': 'Workout data exported.',
  'settings.exportError': 'Export failed. Try again.',
  'settings.importConfirm':
    'Import will replace workout history for dates that overlap with the file. Other data stays unchanged. Continue?',
  'settings.importSuccess': 'Imported {count} records.',
  'settings.importInvalid': 'Invalid file format.',
  'settings.importError': 'Import failed. Try again.',
  'settings.updateToast': 'New version available. Tap to update.',
  'settings.updateAvailable': 'A new version of the app is available.',
  'settings.updateApp': 'Update app',
  'settings.checkForUpdates': 'Check for updates',
  'settings.reloadApp': 'Reload app',
  'settings.upToDate': 'You are on the latest version.',
  'settings.appVersion': 'Version {version}',
  'settings.appUpdates': 'App updates',
  'settings.changelog': 'Changelog',
  'settings.showChangelog': 'View changelog',
  'settings.hideChangelog': 'Hide changelog',
  'settings.cloudSync': 'Cloud backup',
  'settings.cloudSyncHint': 'Replace all remote data for this account with a fresh copy from this device.',
  'settings.syncToDb': 'Sync to database',
  'settings.syncing': 'Syncing…',
  'settings.syncSuccess': 'Data synced to Supabase.',
  'settings.syncError': 'Sync failed. Check connection and try again.',
  'console.title': 'Console',
  'console.empty': 'No logs yet. Errors and console output will appear here.',
  'console.hint': 'Mirrors browser console output for debugging on mobile devices.',
  'console.clear': 'Clear',
  'console.copy': 'Copy all',
  'console.copySuccess': 'Copied',
  'console.count': '{count} entries',
  'common.loading': 'Loading...',
  'common.welcomeBack': 'Welcome back',
  'activity.sedentary': 'Sedentary (×1.2)',
  'activity.light': 'Light activity (×1.375)',
  'activity.moderate': 'Moderate activity (×1.55)',
  'activity.active': 'Active (×1.725)',
  'activity.veryActive': 'Very active (×1.9)',
}

const ru: Record<TranslationKey, string> = {
  'app.name': 'Lazy Trainer',
  'nav.profile': 'Профиль',
  'nav.workouts': 'Тренировки',
  'nav.settings': 'Настройки',
  'nav.console': 'Консоль',
  'nav.signOut': 'Выйти',
  'login.title': 'Lazy Trainer',
  'login.subtitle': 'Войдите, чтобы хранить данные о тренировках локально.',
  'login.missingClientId':
    'Не задан VITE_GOOGLE_CLIENT_ID. Скопируйте .env.example в .env и следуйте docs/GOOGLE_LOGIN.md.',
  'login.failed': 'Не удалось войти через Google. Попробуйте снова.',
  'profile.title': 'Профиль',
  'profile.firstName': 'Имя',
  'profile.lastName': 'Фамилия',
  'profile.dateOfBirth': 'Дата рождения',
  'profile.sex': 'Пол',
  'profile.sexMale': 'Мужской',
  'profile.sexFemale': 'Женский',
  'profile.height': 'Рост (см)',
  'profile.weight': 'Вес (кг)',
  'profile.activity': 'Уровень активности',
  'profile.dailyCalories': 'Калории в день',
  'profile.notSet': 'Не указано',
  'profile.kcal': 'ккал',
  'profile.kcalHint': 'Заполните все поля для расчёта',
  'profile.calorieFormulaTitle': 'Расчёт калорий',
  'profile.calorieFormulaName': 'Формула Mifflin-St Jeor',
  'profile.calorieFormulaBmr':
    'BMR = 10 × {weight} + 6.25 × {height} − 5 × {age} {sexAdjust} = {bmr} ккал',
  'profile.calorieFormulaTdee':
    'TDEE = {bmr} × {multiplier} ({activity}) = {tdee} ккал',
  'profile.calorieFormulaNote':
    'Это оценка калорий для поддержания текущего веса. Чем больше масса тела, тем выше BMR — поэтому результат может казаться большим.',
  'profile.calorieSexAdjustMale': '+ 5',
  'profile.calorieSexAdjustFemale': '− 161',
  'profile.calorieTapHint': 'Нажмите, чтобы увидеть формулу',
  'profile.tabOverview': 'Профиль',
  'profile.tabHistory': 'История',
  'profile.tabMeasurements': 'Объёмы',
  'profile.historyEmpty': 'Обновите вес в профиле, чтобы начать отслеживание.',
  'profile.weightChart': 'Динамика веса',
  'profile.historyList': 'Записи',
  'profile.weightUnit': 'кг',
  'profile.measurePreview': 'Карта тела',
  'profile.measureDate': 'Дата',
  'profile.measureSave': 'Сохранить замеры',
  'profile.measureEmpty': 'Введите первые замеры, чтобы отслеживать прогресс.',
  'profile.measureHistory': 'История',
  'profile.measure.neckCm': 'Шея',
  'profile.measure.shouldersCm': 'Плечи',
  'profile.measure.chestCm': 'Грудь',
  'profile.measure.waistCm': 'Талия',
  'profile.measure.hipsCm': 'Бёдра',
  'profile.measure.bicepCm': 'Бицепс',
  'profile.measure.forearmCm': 'Предплечье',
  'profile.measure.thighCm': 'Бедро',
  'profile.measure.abdomenCm': 'Живот',
  'workouts.title': 'Тренировки',
  'workouts.empty': 'Создайте первый шаблон тренировки.',
  'workouts.tabTemplates': 'Тренировки',
  'workouts.tabExercises': 'Упражнения',
  'workouts.tabHistory': 'История',
  'workouts.newWorkout': 'Новая тренировка',
  'workouts.editWorkout': 'Редактировать',
  'workouts.workoutName': 'Название тренировки',
  'workouts.exerciseName': 'Название упражнения',
  'workouts.addExercise': 'Добавить упражнение',
  'workouts.addSet': 'Добавить подход',
  'workouts.set': 'Подход',
  'workouts.weight': 'Вес (кг)',
  'workouts.reps': 'Повторения',
  'workouts.save': 'Сохранить',
  'workouts.cancel': 'Отмена',
  'workouts.delete': 'Удалить',
  'workouts.start': 'Старт',
  'workouts.edit': 'Изменить',
  'workouts.active': 'В процессе',
  'workouts.continue': 'Продолжить',
  'workouts.complete': 'Завершить',
  'workouts.exercisesCount': '{count} упражнений',
  'workouts.setsCount': '{count} подходов',
  'workouts.selectExercise': 'Выберите упражнение',
  'workouts.exerciseHistoryEmpty': 'Завершите тренировки, чтобы увидеть историю упражнений.',
  'workouts.exerciseHistoryList': 'История подходов',
  'workouts.exerciseDayMaxWeight': 'макс. {weight} {unit}',
  'workouts.exercisePrWeight': 'Макс. вес',
  'workouts.exercisePrVolume': 'Макс. объём',
  'workouts.exerciseSessions': 'Тренировок',
  'workouts.exerciseChartWeight': 'Прогресс веса',
  'workouts.exerciseChartVolume': 'Объём за тренировку',
  'workouts.exerciseChartReps': 'Повторы на макс. весе',
  'workouts.workoutHistoryEmpty': 'Завершённые тренировки появятся здесь.',
  'workouts.totalVolume': 'Итоговый объём',
  'workouts.activeSessionExists': 'Завершите текущую тренировку перед началом новой.',
  'workouts.removeExercise': 'Удалить упражнение',
  'workouts.removeSet': 'Удалить подход',
  'workouts.back': 'Назад',
  'workouts.type': 'Тип тренировки',
  'workouts.typeStrength': 'Силовая',
  'workouts.typeCardio': 'Кардио',
  'workouts.duration': 'Время (мин)',
  'workouts.minutes': 'мин',
  'workouts.cardioEquipment': 'Тренажёр',
  'workouts.cardioDone': 'Тренировка выполнена',
  'workouts.doubleStats': 'Учитывать обе руки в статистике',
  'workouts.doubleStatsHint': 'Повторы на одну руку; в объёме учитываются обе.',
  'workouts.toFailure': 'До отказа',
  'workouts.toFailureHint': 'Введите, сколько повторов удалось сделать до отказа.',
  'workouts.failureRepsTitle': 'Фактические повторы',
  'workouts.failureRepsConfirm': 'Сохранить и завершить',
  'workouts.failureRepsActual': 'Сделано повторов',
  'workouts.historyDetailEmpty': 'Нет деталей по упражнениям для этой тренировки.',
  'workouts.noteTitle': 'Заметка к тренировке',
  'workouts.notePlaceholder': 'Как прошла тренировка? Необязательно.',
  'workouts.noteSave': 'Сохранить и завершить',
  'workouts.historyNote': 'Заметка',
  'workouts.equipment.bike': 'Велосипед',
  'workouts.equipment.treadmill': 'Беговая дорожка',
  'workouts.equipment.elliptical': 'Эллипс',
  'settings.title': 'Настройки',
  'settings.language': 'Язык',
  'settings.account': 'Аккаунт',
  'settings.languageEn': 'English',
  'settings.languageRu': 'Русский',
  'settings.workoutData': 'Данные тренировок',
  'settings.workoutDataHint':
    'Экспорт и импорт шаблонов, упражнений, сессий и истории. Профиль и вес не включаются.',
  'settings.exportWorkouts': 'Экспорт',
  'settings.importWorkouts': 'Импорт',
  'settings.exporting': 'Экспорт…',
  'settings.importing': 'Импорт…',
  'settings.exportSuccess': 'Данные тренировок экспортированы.',
  'settings.exportError': 'Не удалось экспортировать. Попробуйте снова.',
  'settings.importConfirm':
    'Импорт заменит историю тренировок за даты, которые есть в файле. Остальные данные сохранятся. Продолжить?',
  'settings.importSuccess': 'Импортировано записей: {count}.',
  'settings.importInvalid': 'Неверный формат файла.',
  'settings.importError': 'Не удалось импортировать. Попробуйте снова.',
  'settings.updateToast': 'Доступна новая версия. Нажмите, чтобы обновить.',
  'settings.updateAvailable': 'Доступна новая версия приложения.',
  'settings.updateApp': 'Обновить приложение',
  'settings.checkForUpdates': 'Проверить обновления',
  'settings.reloadApp': 'Перезагрузить',
  'settings.upToDate': 'Установлена последняя версия.',
  'settings.appVersion': 'Версия {version}',
  'settings.appUpdates': 'Обновление приложения',
  'settings.changelog': 'История изменений',
  'settings.showChangelog': 'Показать историю изменений',
  'settings.hideChangelog': 'Скрыть историю изменений',
  'settings.cloudSync': 'Облачный бэкап',
  'settings.cloudSyncHint': 'Полностью заменить данные этого аккаунта в Supabase копией с этого устройства.',
  'settings.syncToDb': 'Синхронизировать с БД',
  'settings.syncing': 'Синхронизация…',
  'settings.syncSuccess': 'Данные синхронизированы с Supabase.',
  'settings.syncError': 'Не удалось синхронизировать. Проверьте подключение и попробуйте снова.',
  'console.title': 'Консоль',
  'console.empty': 'Пока пусто. Ошибки и вывод console появятся здесь.',
  'console.hint': 'Дублирует вывод браузерной консоли — удобно для отладки на телефоне.',
  'console.clear': 'Очистить',
  'console.copy': 'Скопировать всё',
  'console.copySuccess': 'Скопировано',
  'console.count': '{count} записей',
  'common.loading': 'Загрузка...',
  'common.welcomeBack': 'С возвращением',
  'activity.sedentary': 'Сидячий образ жизни (×1.2)',
  'activity.light': 'Лёгкая активность (×1.375)',
  'activity.moderate': 'Умеренная активность (×1.55)',
  'activity.active': 'Высокая активность (×1.725)',
  'activity.veryActive': 'Очень высокая активность (×1.9)',
}

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en,
  ru,
}

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'veryActive',
]

export function formatTranslation(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? `{${key}}`),
  )
}
