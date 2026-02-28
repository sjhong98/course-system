import { PADDING } from '@/shared/libs/constants/constants'
import React from 'react'

type PaddingHorizontalOverrideContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType
  children?: React.ReactNode
  paddingHorizontal?: boolean
}

// 패딩 무효화 Wrapper 컴포넌트

export default function PaddingHorizontalOverrideContainer({
  as,
  children,
  style,
  className,
  paddingHorizontal,
  ...rest
}: PaddingHorizontalOverrideContainerProps) {
  const Component = as ?? 'div'
  const minusMarginValue = `-${PADDING}px`

  const marginStyle: React.CSSProperties = {
    marginRight: minusMarginValue,
    marginLeft: minusMarginValue,
  }

  return (
    <Component
      className={`${className ?? ''}`}
      style={{ ...marginStyle, ...style, ...(paddingHorizontal ? { paddingLeft: `${PADDING}px`, paddingRight: `${PADDING}px` } : {}) }}
      {...rest}
    >
      {children}
    </Component>
  )
}
