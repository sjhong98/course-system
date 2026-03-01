'use client'

import useAuth from '@/features/auth/hooks/useAuth'
import { toggleThemeAndSync } from '@/shared/libs/utils/theme'
import { HEADER_HEIGHT, PADDING } from '@/shared/libs/constants/constants'
import { useEffect, useMemo, useRef, useState } from 'react'
import PaddingHorizontalOverrideContainer from '@/shared/components/container/PaddingHorizontalOverrideContainer'
import Column from '@/shared/components/flexBox/Column'
import { signOut } from '@/features/auth/action/signOut'
import { usePathname } from 'next/navigation'

const MENU_OPEN_TIME = 300
const BACKDROP_OPEN_TIME = MENU_OPEN_TIME - 10

type MenuProps = {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}

type MenuItem = {
  label: string
  onClick: () => void
  condition?: boolean
}

// 메뉴 컴포넌트

export default function Menu({ menuOpen, setMenuOpen }: MenuProps) {
  const { completeSignOut } = useAuth()
  const pathname = usePathname()
  const [menuContentHeight, setMenuContentHeight] = useState(0)
  const [currentMenuHeight, setCurrentMenuHeight] = useState(0)
  const [backdropVisible, setBackdropVisible] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        label: '로그아웃',
        onClick: () => {
          signOut()
          completeSignOut()
          setMenuOpen(false)
        },
        condition: pathname !== '/signin' && pathname !== '/signup',
      },
      {
        label: '테마 변경',
        onClick: toggleThemeAndSync,
      },
    ],
    [pathname],
  )

  useEffect(() => {
    if (menuOpen) {
      setCurrentMenuHeight(menuContentHeight)
      setBackdropVisible(true)
    } else {
      setCurrentMenuHeight(0)
      setTimeout(() => {
        setBackdropVisible(false)
      }, BACKDROP_OPEN_TIME)
    }
  }, [menuOpen])

  useEffect(() => {
    const el = menuRef.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      setMenuContentHeight(el.scrollHeight)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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
        <Column as="nav" className="flex-shrink-0 w-full items-end" style={{ paddingRight: `${PADDING}px` }}>
          <Column ref={menuRef} gap={24} className="pt-10 pb-8 h-fit">
            {menuItems.map((item) => {
              const isVisible = item.condition === undefined || item.condition === true
              return isVisible ? (
                <button
                  key={item.label}
                  role="menuitem"
                  className="flex gap-2 items-center justify-start gap-2 cursor-pointer select-none cursor-pointer text-sm py-1"
                  onClick={item.onClick}
                  aria-label={item.label}
                >
                  {item.label}
                </button>
              ) : null
            })}
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
