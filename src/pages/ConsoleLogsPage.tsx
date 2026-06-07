import { Check, Copy, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useConsoleLogs } from '@/hooks/useConsoleLogs'
import { useI18n } from '@/i18n/context'
import {
  clearConsoleLogs,
  formatConsoleLogsForCopy,
  type ConsoleLogEntry,
  type ConsoleLogLevel,
} from '@/lib/console-capture'
import { cn } from '@/lib/utils'

const levelStyles: Record<ConsoleLogLevel, string> = {
  log: 'text-foreground',
  info: 'text-sky-400',
  warn: 'text-amber-400',
  error: 'text-destructive',
  debug: 'text-muted-foreground',
}

const levelBadgeStyles: Record<ConsoleLogLevel, string> = {
  log: 'bg-secondary text-secondary-foreground',
  info: 'bg-sky-500/15 text-sky-400',
  warn: 'bg-amber-500/15 text-amber-400',
  error: 'bg-destructive/15 text-destructive',
  debug: 'bg-muted text-muted-foreground',
}

function LogRow({ entry, language }: { entry: ConsoleLogEntry; language: 'en' | 'ru' }) {
  const time = new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  }).format(entry.timestamp)

  return (
    <div className="border-b border-border/40 px-3 py-2 font-mono text-[11px] leading-relaxed">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-muted-foreground">{time}</span>
        <span
          className={cn(
            'rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase',
            levelBadgeStyles[entry.level],
          )}
        >
          {entry.level}
        </span>
      </div>
      <pre className={cn('whitespace-pre-wrap break-all', levelStyles[entry.level])}>
        {entry.message}
      </pre>
      {entry.stack && (
        <pre className="mt-1 whitespace-pre-wrap break-all text-muted-foreground">
          {entry.stack}
        </pre>
      )}
    </div>
  )
}

export function ConsoleLogsPage() {
  const { t, language } = useI18n()
  const logs = useConsoleLogs()
  const listRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    list.scrollTop = list.scrollHeight
  }, [logs.length])

  async function handleCopy() {
    const text = formatConsoleLogsForCopy(logs)
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex shrink-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={logs.length === 0}
          onClick={() => void handleCopy()}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? t('console.copySuccess') : t('console.copy')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={logs.length === 0}
          onClick={() => clearConsoleLogs()}
        >
          <Trash2 className="size-4" />
          {t('console.clear')}
        </Button>
      </div>

      <p className="shrink-0 text-xs text-muted-foreground">{t('console.hint')}</p>

      <div
        ref={listRef}
        className="sport-card min-h-0 flex-1 overflow-y-auto bg-black/20"
      >
        {logs.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {t('console.empty')}
          </p>
        ) : (
          logs.map((entry) => (
            <LogRow key={entry.id} entry={entry} language={language} />
          ))
        )}
      </div>

      <p className="shrink-0 text-center text-xs text-muted-foreground">
        {t('console.count').replace('{count}', String(logs.length))}
      </p>
    </div>
  )
}
