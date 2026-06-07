import { Menu } from 'lucide-react'
import { type ReactNode } from 'react'

import { usePageHeader } from '@/components/layout/PageHeaderContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  onMenuClick: () => void
  className?: string
}

export function PageHeader({ title, onMenuClick, className }: PageHeaderProps) {
  const { headerAction } = usePageHeader()

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/80 bg-card/90 px-4 backdrop-blur-md',
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>
      <h1 className="min-w-0 flex-1 truncate text-lg font-bold tracking-tight">{title}</h1>
      <div className="flex size-9 shrink-0 items-center justify-center">
        {headerAction}
      </div>
    </header>
  )
}

export function PageContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4', className)}>
      {children}
    </div>
  )
}
