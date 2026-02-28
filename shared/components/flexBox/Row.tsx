import React from 'react'

export type RowProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode
  gap?: number
  ref?: React.RefObject<HTMLDivElement | null>
}

export default function Row({ children, className, gap = 0, style, ref, ...rest }: RowProps) {
  return (
    <div className={`flex flex-row ${className}`} style={{ gap: `${gap}px`, ...style }} ref={ref} {...rest}>
      {children}
    </div>
  )
}
