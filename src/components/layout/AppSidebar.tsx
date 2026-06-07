import {
  Dumbbell,
  LogOut,
  Settings,
  Terminal,
  User,
} from 'lucide-react'

import { UserAvatar } from '@/components/UserAvatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/utils'

export type AppPage = 'profile' | 'workouts' | 'settings' | 'console'

interface AppSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
  onSignOut: () => void
  userName: string
  userEmail: string
  userPicture: string
}

const navItems: { page: AppPage; icon: typeof User; labelKey: 'nav.profile' | 'nav.workouts' | 'nav.settings' | 'nav.console' }[] = [
  { page: 'profile', icon: User, labelKey: 'nav.profile' },
  { page: 'workouts', icon: Dumbbell, labelKey: 'nav.workouts' },
  { page: 'settings', icon: Settings, labelKey: 'nav.settings' },
  { page: 'console', icon: Terminal, labelKey: 'nav.console' },
]

export function AppSidebar({
  open,
  onOpenChange,
  currentPage,
  onNavigate,
  onSignOut,
  userName,
  userEmail,
  userPicture,
}: AppSidebarProps) {
  const { t } = useI18n()

  function handleNavigate(page: AppPage) {
    onNavigate(page)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-[min(100%,280px)] flex-col border-border/80 bg-sidebar p-0">
        <SheetHeader className="border-b border-border/80 bg-card/50 p-4 text-left">
          <div className="flex items-center gap-3 pr-8">
            <UserAvatar
              src={userPicture}
              name={userName}
              className="size-11"
              ring
            />
            <div className="min-w-0">
              <SheetTitle className="truncate text-base">{userName}</SheetTitle>
              <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex flex-col gap-1 p-2">
          {navItems.map(({ page, icon: Icon, labelKey }) => (
            <Button
              key={page}
              variant={currentPage === page ? 'secondary' : 'ghost'}
              className={cn(
                'h-11 w-full justify-start gap-3 px-3',
                currentPage === page && 'font-medium',
              )}
              onClick={() => handleNavigate(page)}
            >
              <Icon className="size-4" />
              {t(labelKey)}
            </Button>
          ))}
        </nav>

        <div className="mt-auto p-2">
          <Separator className="mb-2" />
          <Button
            variant="ghost"
            className="h-11 w-full justify-start gap-3 px-3 text-destructive hover:text-destructive"
            onClick={() => {
              onOpenChange(false)
              onSignOut()
            }}
          >
            <LogOut className="size-4" />
            {t('nav.signOut')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
