import { useCallback } from 'react'

import { cn } from '@/shared/libs/utils/cn'
import Column, { ColumnProps } from '../flexBox/Column'
import Row from '../flexBox/Row'
import CheckBox, { CheckBoxProps } from './CheckBox'

export namespace SelectableList {
  export type SelectableListContainerProps = ColumnProps & {
    children?: React.ReactNode
    'aria-label'?: string
  }

  export type SelectableListItemProps = CheckBoxProps & {
    children?: React.ReactNode
    selected?: boolean
    selectable?: boolean
    className?: string
    onSelect?: (e?: any) => void
    'aria-label'?: string
  }

  export function Container({ children, 'aria-label': ariaLabel, ...rest }: SelectableListContainerProps) {
    return (
      <Column role="list" as="section" className={cn('scrollbar-thin flex-shrink-0', rest.className)} aria-label={ariaLabel} {...rest}>
        {children}
      </Column>
    )
  }

  export function Item({
    children,
    selected,
    selectable = true,
    onSelect,
    onChange,
    'aria-label': ariaLabel,
    ...rest
  }: SelectableListItemProps) {
    const handleSelect = useCallback(() => {
      if (rest.disabled) return
      onSelect?.()
    }, [rest.disabled, onSelect])

    return (
      <Row
        role="listitem"
        gap={20}
        className={cn('transition-all duration-100 mb-[10px]', selectable && rest.disabled ? 'cursor-normal' : 'cursor-pointer')}
        onClick={handleSelect}
        aria-label={ariaLabel}
      >
        {selectable && <CheckBox checked={selected} onChange={handleSelect} {...rest} />}
        {children}
      </Row>
    )
  }
}
