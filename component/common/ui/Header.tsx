import { PADDING } from "@/app/layout";
import PaddingHorizontalOverrideContainer from "@/component/common/container/PaddingHorizontalOverrideContainer";

export const HEADER_HEIGHT = 50

export default function Header() {
  return (
    <>
      <div className='flex items-center justify-center text-2xl font-extrabold tracking-[-1.5px] fixed top-0 left-0 right-0 bg-white' style={{ height: `${HEADER_HEIGHT}px` }}>COURSE</div>
      <PaddingHorizontalOverrideContainer className='flex items-center justify-center' style={{ height: `${HEADER_HEIGHT - PADDING}px` }} />
    </>
  )
}