import type { Language } from '@/db'

export interface ChangelogEntry {
  version: string
  date: string
  changes: Record<Language, string[]>
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '0.0.10',
    date: '2026-06-07',
    changes: {
      ru: [
        'Новый премиальный дизайн: светлая тёплая тема, оранжевые акценты, стеклянные панели',
        'Нижняя навигация вместо бокового меню',
        'Карточки шаблонов с фото, обновлённые графики и экран входа',
        'Выход из аккаунта и консоль разработчика — в настройках',
      ],
      en: [
        'Premium UI: warm light theme, orange accents, glass panels',
        'Bottom navigation instead of sidebar menu',
        'Photo-backed template cards, refreshed charts and login screen',
        'Sign out and dev console moved to Settings',
      ],
    },
  },
  {
    version: '0.0.9',
    date: '2026-06-07',
    changes: {
      ru: [
        'Кнопки «Проверить обновления» и «Перезагрузить» в настройках',
        'Тост обновления сразу применяет новую версию',
        'Автопроверка обновлений при возврате в приложение',
      ],
      en: [
        'Check for updates and Reload buttons in settings',
        'Update toast applies the new version directly',
        'Auto-check for updates when returning to the app',
      ],
    },
  },
  {
    version: '0.0.8',
    date: '2026-06-07',
    changes: {
      ru: ['Нативные системные селекторы вместо кастомных выпадающих списков'],
      en: ['Native OS pickers instead of custom dropdowns'],
    },
  },
  {
    version: '0.0.7',
    date: '2026-06-07',
    changes: {
      ru: [
        'Улучшения UI/UX на экранах тренировок',
        'Выбор упражнений из истории при создании шаблона',
        'Подходы до отказа на активной тренировке и отметки в истории',
        'Обновлено резервное копирование в Supabase',
      ],
      en: [
        'UI/UX improvements across workout screens',
        'Pick exercises from history when building a template',
        'To-failure sets during active workouts, marked in history',
        'Supabase backup updates',
      ],
    },
  },
  {
    version: '0.0.6',
    date: '2026-06-07',
    changes: {
      ru: [
        'Заметка к тренировке при завершении',
        'Заметки видны в истории тренировок',
      ],
      en: [
        'Workout note when finishing a session',
        'Notes visible in workout history',
      ],
    },
  },
  {
    version: '0.0.5',
    date: '2026-06-07',
    changes: {
      ru: ['Чейнджлог версий в настройках в разделе обновления приложения'],
      en: ['Version changelog in settings under app updates'],
    },
  },
  {
    version: '0.0.4',
    date: '2026-06-07',
    changes: {
      ru: ['Исправлен перевод выбранного значения в выпадающих списках'],
      en: ['Fixed translated label for selected value in dropdowns'],
    },
  },
  {
    version: '0.0.3',
    date: '2026-06-07',
    changes: {
      ru: ['Страница тренировок открывается по умолчанию'],
      en: ['Workouts page is now the default home screen'],
    },
  },
  {
    version: '0.0.2',
    date: '2026-06-07',
    changes: {
      ru: ['Исправлено обрезание аватарки в профиле'],
      en: ['Fixed avatar cropping on the profile page'],
    },
  },
  {
    version: '0.0.1',
    date: '2026-06-07',
    changes: {
      ru: [
        'Ручное обновление PWA: проверка версии при входе',
        'Тост о новой версии и кнопка «Обновить» в настройках',
      ],
      en: [
        'Manual PWA updates: version check on app launch',
        'Update toast and update button in settings',
      ],
    },
  },
]
