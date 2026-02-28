'use client'

import useAuth from '@/shared/hooks/useAuth'
import { HEADER_HEIGHT, PADDING } from '@/shared/libs/constants/constants'
import { useEffect, useRef, useState } from 'react'
import PaddingHorizontalOverrideContainer from '../container/PaddingHorizontalOverrideContainer'
import Column from '../flexBox/Column'

export default function Menu({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const { completeSignOut } = useAuth()
  const [menuContentHeight, setMenuContentHeight] = useState(0)
  const [currentMenuHeight, setCurrentMenuHeight] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuItems = [
    {
      label: '로그아웃',
      onClick: () => {
        completeSignOut()
        setMenuOpen(false)
      },
    },
    {
      label: '테마 변경',
      onClick: () => {
        const theme = localStorage.getItem('theme')
        if (theme === 'dark') {
          localStorage.setItem('theme', 'light')
        } else {
          localStorage.setItem('theme', 'dark')
        }
      },
    },
  ]

  useEffect(() => {
    if (menuOpen) {
      setCurrentMenuHeight(menuContentHeight)
    } else {
      setCurrentMenuHeight(0)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuRef.current) return
    setMenuContentHeight(menuRef.current.scrollHeight)
  }, [menuOpen])

  return (
    <PaddingHorizontalOverrideContainer
      className="flex tracking-[-1.5px] absolute left-0 right-0 flex-shrink-0 z-[100] bg-[var(--background)] border-[var(--background-tertiary)] transition-all duration-200 overflow-hidden"
      style={{
        top: `${HEADER_HEIGHT}px`,
        height: `${currentMenuHeight}px`,
        borderBottomWidth: menuOpen ? '1px' : '0px',
        paddingRight: `${PADDING}px`,
      }}
    >
      <Column ref={menuRef} className="flex-shrink-0 w-full items-end" style={{ paddingRight: `${PADDING}px` }}>
        <Column gap={12} className="pb-5">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="flex gap-2 items-center justify-start gap-2 cursor-pointer select-none"
              onClick={item.onClick}
            >
              <p className="text-sm">{item.label}</p>
            </button>
          ))}
        </Column>
      </Column>
    </PaddingHorizontalOverrideContainer>
  )
}
