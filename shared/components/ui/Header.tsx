import PaddingHorizontalOverrideContainer from '@/shared/components/container/PaddingHorizontalOverrideContainer'
import { HEADER_HEIGHT, PADDING } from '@/shared/libs/constants/constants'
import { MenuIcon, XIcon } from 'lucide-react'

export default function Header({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  return (
    <>
      <PaddingHorizontalOverrideContainer
        className="flex items-center justify-center text-2xl font-extrabold tracking-[-1.5px] sticky top-0 left-0 right-0 flex-shrink-0 z-[100] relative select-none"
        style={{
          height: `${HEADER_HEIGHT}px`,
          backgroundColor: 'var(--background)',
        }}
      >
        <h1>COURSE</h1>
        {menuOpen ? (
          <XIcon className="w-4 h-4 absolute cursor-pointer" style={{ right: `${PADDING}px` }} onClick={() => setMenuOpen(!menuOpen)} />
        ) : (
          <MenuIcon className="w-4 h-4 absolute cursor-pointer" style={{ right: `${PADDING}px` }} onClick={() => setMenuOpen(!menuOpen)} />
        )}
      </PaddingHorizontalOverrideContainer>
    </>
  )
}
