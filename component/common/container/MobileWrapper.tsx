import { PADDING } from "@/app/layout";

export default function MobileWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full max-w-[500px] h-screen overflow-y-auto outline outline-neutral-200' style={{ padding: `${PADDING}px` }}>
      <div className='relative w-full h-fit min-h-full'>
        {children}
      </div>
    </div>
  )
}