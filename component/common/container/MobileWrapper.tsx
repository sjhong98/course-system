import { PADDING } from "@/lib/constants/constants";

export default function MobileWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className='w-full max-w-[500px] h-full flex outline outline-neutral-200 relative overflow-x-hidden scrollbar-thin'
      style={{ paddingLeft: `${PADDING}px`, paddingRight: `${PADDING}px` }}
    >
      <div className='h-full w-full flex flex-col'>
        {children}
      </div>
    </div>
  )
}