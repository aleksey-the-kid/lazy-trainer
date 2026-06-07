export type ConsoleLogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

export interface ConsoleLogEntry {
  id: string
  level: ConsoleLogLevel
  message: string
  timestamp: Date
  stack?: string
}

const MAX_ENTRIES = 1000

let nextId = 0
let entries: ConsoleLogEntry[] = []
const listeners = new Set<() => void>()
let initialized = false

function notify() {
  for (const listener of listeners) {
    listener()
  }
}

function addEntry(level: ConsoleLogLevel, message: string, stack?: string) {
  entries = [
    ...entries,
    {
      id: String(nextId++),
      level,
      message,
      timestamp: new Date(),
      stack,
    },
  ].slice(-MAX_ENTRIES)

  notify()
}

function serializeArg(value: unknown): string {
  if (value instanceof Error) {
    return value.stack ?? `${value.name}: ${value.message}`
  }

  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }

  return String(value)
}

function serializeArgs(args: unknown[]): string {
  return args.map(serializeArg).join(' ')
}

export function initConsoleCapture() {
  if (initialized) return
  initialized = true

  const levels: ConsoleLogLevel[] = ['log', 'info', 'warn', 'error', 'debug']

  for (const level of levels) {
    const original = console[level].bind(console)

    console[level] = (...args: unknown[]) => {
      original(...args)

      const message = serializeArgs(args)
      const stack =
        level === 'error' && args[0] instanceof Error ? args[0].stack : undefined

      addEntry(level, message, stack)
    }
  }

  window.addEventListener('error', (event) => {
    addEntry(
      'error',
      `${event.message} (${event.filename}:${event.lineno}:${event.colno})`,
      event.error instanceof Error ? event.error.stack : undefined,
    )
  })

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    const message =
      reason instanceof Error
        ? `${reason.name}: ${reason.message}`
        : serializeArg(reason)

    addEntry(
      'error',
      `Unhandled rejection: ${message}`,
      reason instanceof Error ? reason.stack : undefined,
    )
  })

  addEntry('info', 'Console capture started')
}

export function getConsoleLogs(): readonly ConsoleLogEntry[] {
  return entries
}

export function subscribeConsoleLogs(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function clearConsoleLogs() {
  entries = []
  notify()
}

export function formatConsoleLogsForCopy(logs: readonly ConsoleLogEntry[]): string {
  return logs
    .map((entry) => {
      const time = entry.timestamp.toISOString()
      const lines = [`[${time}] [${entry.level.toUpperCase()}] ${entry.message}`]
      if (entry.stack) {
        lines.push(entry.stack)
      }
      return lines.join('\n')
    })
    .join('\n\n')
}
