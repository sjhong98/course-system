import Column from '@/shared/components/flexBox/Column'
import Skeleton from '@/shared/components/ui/Skeleton'

// 강의 상세 스켈레톤 컴포넌트

export default function CourseDetailSkeleton() {
  return (
    <Column gap={10} className="w-full h-full">
      <Skeleton height={120} />
      <Column gap={10} className="w-full items-end">
        <Column className="w-[30%]">
          <Skeleton height={40} />
        </Column>
        <Column className="w-[25%]">
          <Skeleton height={40} />
        </Column>
      </Column>
      <Column className="mt-auto pb-10">
        <Skeleton height={40} />
      </Column>
    </Column>
  )
}
