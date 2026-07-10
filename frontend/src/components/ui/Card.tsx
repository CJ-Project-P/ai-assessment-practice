import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type CardProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <button
      className={cn(
        'cursor-pointer rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  )
}
