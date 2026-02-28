import Column from '@/shared/components/flexBox/Column'
import Skeleton from '@/shared/components/ui/Skeleton'

export default function Loading() {
  return (
    <Column gap={10}>
      <Skeleton height={25} />
      <Skeleton height={25} />
      <Skeleton height={25} />
    </Column>
  )
}
