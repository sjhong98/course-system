import Column from '@/shared/components/flexBox/Column'
import Skeleton from '@/shared/components/ui/Skeleton'

export default function CourseListSkeleton() {
  return (
    <Column gap={10}>
      <Skeleton height={80} />
      <Skeleton height={80} />
      <Skeleton height={80} />
    </Column>
  )
}
