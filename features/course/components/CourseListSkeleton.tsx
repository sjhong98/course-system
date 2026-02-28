import Column from '@/shared/components/flexBox/Column'
import Skeleton from '@/shared/components/ui/Skeleton'

// 강의 목록 스켈레톤 컴포넌트

export default function CourseListSkeleton() {
  return (
    <Column gap={10}>
      <Skeleton height={80} />
      <Skeleton height={80} />
      <Skeleton height={80} />
    </Column>
  )
}
