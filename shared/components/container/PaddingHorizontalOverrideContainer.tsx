import { PADDING } from '@/shared/libs/constants/constants'
import React from 'react'

type PaddingHorizontalOverrideContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode
  paddingHorizontal?: boolean
}

export default function PaddingHorizontalOverrideContainer({
  children,
  style,
  className,
  paddingHorizontal,
  ...rest
}: PaddingHorizontalOverrideContainerProps) {
  const minusMarginValue = `-${PADDING}px`

  const marginStyle: React.CSSProperties = {
    marginRight: minusMarginValue,
    marginLeft: minusMarginValue,
  }

  return (
    <div
      className={`${className ?? ''}`}
      style={{ ...marginStyle, ...style, ...(paddingHorizontal ? { paddingLeft: `${PADDING}px`, paddingRight: `${PADDING}px` } : {}) }}
      {...rest}
    >
      {children}
    </div>
  )
}
