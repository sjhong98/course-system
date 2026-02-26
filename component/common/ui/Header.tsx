import PaddingHorizontalOverrideContainer from "@/component/common/container/PaddingHorizontalOverrideContainer";

export const HEADER_HEIGHT = 50

export default function Header() {
  return (
    <>
      <PaddingHorizontalOverrideContainer className='flex items-center justify-center text-2xl font-extrabold tracking-[-1.5px] sticky top-0 left-0 right-0 flex-shrink-0 z-[100]' style={{ height: `${HEADER_HEIGHT}px`, backgroundColor: 'var(--background)' }}>
        <h1>COURSE</h1>
      </PaddingHorizontalOverrideContainer>
    </>
  )
}