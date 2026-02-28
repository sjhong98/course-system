'use client'

import { dispatchThemeChange } from '@/shared/components/ui/ThemeSyncToastContainer'
import useAuth from '@/shared/hooks/useAuth'
import { HEADER_HEIGHT, PADDING } from '@/shared/libs/constants/constants'
import { useEffect, useRef, useState } from 'react'
import PaddingHorizontalOverrideContainer from '../container/PaddingHorizontalOverrideContainer'
import Column from '../flexBox/Column'

const MENU_OPEN_TIME = 300

export default function Menu({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const { completeSignOut } = useAuth()
  const [menuContentHeight, setMenuContentHeight] = useState(0)
  const [currentMenuHeight, setCurrentMenuHeight] = useState(0)
  const [backdropVisible, setBackdropVisible] = useState(false)
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
          document.documentElement.classList.remove('dark')
          dispatchThemeChange('light')
        } else {
          localStorage.setItem('theme', 'dark')
          document.documentElement.classList.add('dark')
          dispatchThemeChange('dark')
        }
      },
    },
  ]

  useEffect(() => {
    if (menuOpen) {
      setCurrentMenuHeight(menuContentHeight)
      setBackdropVisible(true)
    } else {
      setCurrentMenuHeight(0)
      setTimeout(() => {
        setBackdropVisible(false)
      }, MENU_OPEN_TIME - 10)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuRef.current) return
    setMenuContentHeight(menuRef.current.scrollHeight)
  }, [menuOpen])

  return (
    <>
      <PaddingHorizontalOverrideContainer
        role="menu"
        aria-label="사용자 메뉴"
        className="flex tracking-[-1.5px] absolute left-0 right-0 flex-shrink-0 z-[100] bg-[var(--background)] border-[var(--background-tertiary)] transition-[height] overflow-hidden"
        style={{
          top: `${HEADER_HEIGHT}px`,
          height: `${currentMenuHeight}px`,
          borderBottomWidth: menuOpen ? '1px' : '0px',
          paddingRight: `${PADDING}px`,
          transitionDuration: `${MENU_OPEN_TIME}ms`,
        }}
      >
        <Column ref={menuRef} className="flex-shrink-0 w-full items-end" style={{ paddingRight: `${PADDING}px` }}>
          <Column gap={24} className="pb-6 pt-10">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className="flex gap-2 items-center justify-start gap-2 cursor-pointer select-none"
                onClick={item.onClick}
                aria-label={item.label}
              >
                <p className="text-sm">{item.label}</p>
              </button>
            ))}
          </Column>
        </Column>
      </PaddingHorizontalOverrideContainer>
      {backdropVisible && (
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="absolute top-0 left-0 h-screen w-screen bg-black/50 z-[95] cursor-default"
          style={{ animation: menuOpen ? `opacity-up ${MENU_OPEN_TIME}ms ease-in-out` : `opacity-down ${MENU_OPEN_TIME}ms ease-in-out` }}
          aria-label="메뉴 닫기"
        />
      )}
    </>
  )
}
