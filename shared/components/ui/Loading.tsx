import Column from '@/shared/components/flexBox/Column'
import Skeleton from '@/shared/components/ui/Skeleton'

// 공통 스켈레톤 컴포넌트

export default function Loading() {
  return (
    <Column gap={10}>
      <Skeleton height={25} />
      <Skeleton height={25} />
      <Skeleton height={25} />
    </Column>
  )
}
