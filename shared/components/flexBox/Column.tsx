import React from 'react'

export type ColumnProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType
  children?: React.ReactNode
  gap?: number
  ref?: React.RefObject<HTMLDivElement | null>
}

export default function Column({ as, children, className, gap = 0, style, ref, ...rest }: ColumnProps) {
  const Component = as ?? 'div'
  return (
    <Component className={`flex flex-col ${className ?? ''}`} style={{ gap: `${gap}px`, ...style }} ref={ref} {...rest}>
      {children}
    </Component>
  )
}
