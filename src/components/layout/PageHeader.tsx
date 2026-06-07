import { UserAvatar } from '@/components/UserAvatar'
import { usePageHeader } from '@/components/layout/PageHeaderContext'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  userName: string
  userPicture: string
  greeting: string
  className?: string
}

export function PageHeader({ userName, userPicture, greeting, className }: PageHeaderProps) {
  const { headerAction } = usePageHeader()
  const firstName = userName.split(' ')[0] ?? userName

  return (
    <header className={cn('sticky top-0 z-30 px-1 pt-2 pb-3', className)}>
      <div className="flex items-center gap-3">
        <UserAvatar src={userPicture} name={userName} className="size-11" ring />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{greeting}</p>
          <h1 className="truncate text-xl font-bold tracking-tight">{firstName}</h1>
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center">
          {headerAction}
        </div>
      </div>
    </header>
  )
}

export function PageContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))]',
        className,
      )}
    >
      {children}
    </div>
  )
}
