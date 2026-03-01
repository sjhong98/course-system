'use client'

import { useState } from 'react'

import Column from '@/shared/components/flexBox/Column'
import Header from '@/shared/components/ui/Header'
import Menu from '@/shared/components/ui/Menu'
import { PADDING, PAGE_HEIGHT } from '@/shared/libs/constants/constants'

// 모바일 Wrapper 컴포넌트

export default function MobileWrapper({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div
      className="w-full max-w-[500px] h-full flex outline outline-[var(--background-tertiary)] relative overflow-x-hidden scrollbar-thin"
      style={{ paddingLeft: `${PADDING}px`, paddingRight: `${PADDING}px` }}
    >
      <div className="h-full w-full flex flex-col">
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Column as="main" className="relative" style={{ height: PAGE_HEIGHT, maxHeight: PAGE_HEIGHT }}>
          {children}
        </Column>
      </div>
    </div>
  )
}
