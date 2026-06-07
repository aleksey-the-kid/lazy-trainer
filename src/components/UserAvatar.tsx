import { cn } from '@/lib/utils'

function normalizeGooglePictureUrl(url: string): string {
  if (!url.includes('googleusercontent.com')) return url

  const withoutSize = url.replace(/=s\d+-c(?:\?.*)?$/, '').replace(/=s\d+(?:\?.*)?$/, '')
  return `${withoutSize}=s256`
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

interface UserAvatarProps {
  src: string
  name: string
  className?: string
  ring?: boolean
}

export function UserAvatar({ src, name, className, ring = false }: UserAvatarProps) {
  const initials = getInitials(name) || '?'

  return (
    <div
      className={cn(
        'relative shrink-0 rounded-full',
        ring && 'ring-2 ring-primary/60 ring-offset-2 ring-offset-background',
        className,
      )}
    >
      <div className="size-full overflow-hidden rounded-full bg-secondary">
        {src ? (
          <img
            src={normalizeGooglePictureUrl(src)}
            alt={name}
            referrerPolicy="no-referrer"
            className="size-full object-cover object-top"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
              const fallback = event.currentTarget.nextElementSibling
              if (fallback instanceof HTMLElement) {
                fallback.style.display = 'flex'
              }
            }}
          />
        ) : null}
        <span
          className="flex size-full items-center justify-center bg-primary/15 text-sm font-bold text-primary"
          style={{ display: src ? 'none' : 'flex' }}
        >
          {initials}
        </span>
      </div>
    </div>
  )
}
