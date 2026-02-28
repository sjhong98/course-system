import React from 'react'

import { cn } from '@/shared/libs/utils/cn'
import LoadingSpinner from './LoadingSpinner'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
  processing?: boolean
}

export default function Button({ children, className, processing, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        `flex items-center justify-center p-2 w-full text-white rounded-lg transition-all duration-100`,
        className,
        rest.disabled ? 'opacity-50 cursor-normal bg-neutral-300' : 'cursor-pointer bg-neutral-700',
        processing || rest.disabled ? '' : 'active:scale-98 active:bg-neutral-800',
      )}
      disabled={processing || rest.disabled}
      {...rest}
    >
      {processing ? <LoadingSpinner /> : children}
    </button>
  )
}
