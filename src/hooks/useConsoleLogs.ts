import { useSyncExternalStore } from 'react'

import {
  getConsoleLogs,
  subscribeConsoleLogs,
} from '@/lib/console-capture'

export function useConsoleLogs() {
  return useSyncExternalStore(subscribeConsoleLogs, getConsoleLogs, getConsoleLogs)
}
