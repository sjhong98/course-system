'use server'

import { PADDING, PAGE_HEIGHT } from '@/shared/libs/constants/constants'
import Column from '../flexBox/Column'
import Header from '../ui/Header'

export default async function MobileWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full max-w-[500px] h-full flex outline outline-neutral-200 relative overflow-x-hidden scrollbar-thin"
      style={{ paddingLeft: `${PADDING}px`, paddingRight: `${PADDING}px` }}
    >
      <div className="h-full w-full flex flex-col">
        <Header />
        <Column className="relative" style={{ height: PAGE_HEIGHT, maxHeight: PAGE_HEIGHT }}>
          {children}
        </Column>
      </div>
    </div>
  )
}
