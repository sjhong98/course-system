export default function Skeleton({ height = 25, delay = 0 }: { height?: number, delay?: number }) {
    return (
        <div className="opacity-up" style={{ animationDelay: `${delay}ms` }}>
            <div className="w-full bg-neutral-200 rounded-lg animate-pulse" style={{ height: `${height}px` }} />
        </div>
    )
}