import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'cursor-pointer rounded-lg px-8 py-4 text-base font-semibold transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40',
        variant === 'primary' &&
          'bg-accent text-on-primary hover:-translate-y-px hover:opacity-90',
        variant === 'secondary' &&
          'border-2 border-primary text-primary hover:bg-primary/5',
        className,
      )}
      {...props}
    />
  )
}
