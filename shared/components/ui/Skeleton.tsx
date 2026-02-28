// 공통 스켈레톤 컴포넌트

export default function Skeleton({ height = 25, delay = 0 }: { height?: number; delay?: number }) {
  return (
    <div className="opacity-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="w-full bg-[var(--background-tertiary)] rounded-lg animate-pulse" style={{ height: `${height}px` }} />
    </div>
  )
}
