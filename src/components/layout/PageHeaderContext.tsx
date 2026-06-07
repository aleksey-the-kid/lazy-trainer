import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface PageHeaderContextValue {
  setHeaderAction: (action: ReactNode) => void
  headerAction: ReactNode
}

const PageHeaderContext = createContext<PageHeaderContextValue | null>(null)

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [headerAction, setHeaderAction] = useState<ReactNode>(null)

  const value = useMemo(
    () => ({ headerAction, setHeaderAction }),
    [headerAction],
  )

  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  )
}

export function usePageHeader() {
  const context = useContext(PageHeaderContext)
  if (!context) {
    throw new Error('usePageHeader must be used within PageHeaderProvider')
  }
  return context
}
