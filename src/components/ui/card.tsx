import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const cardVariants = cva('text-card-foreground', {
  variants: {
    variant: {
      default: 'sport-card',
      accent: 'sport-card-accent',
      hero: 'sport-card-hero',
      stat: 'sport-card-stat',
      glass: 'glass-panel rounded-2xl',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

function Card({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1 p-5 pb-0', className)} {...props} />
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-bold leading-tight tracking-tight', className)} {...props} />
  )
}

function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle, cardVariants }
