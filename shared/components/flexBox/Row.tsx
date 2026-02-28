import React from 'react'

export type RowProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType
  children?: React.ReactNode
  gap?: number
  ref?: React.RefObject<HTMLDivElement | null>
}

export default function Row({ as, children, className, gap = 0, style, ref, ...rest }: RowProps) {
  const Component = as ?? 'div'
  return (
    <Component className={`flex flex-row ${className ?? ''}`} style={{ gap: `${gap}px`, ...style }} ref={ref} {...rest}>
      {children}
    </Component>
  )
}
