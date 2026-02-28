import Column from '../flexBox/Column'
import Skeleton from './Skeleton'

export default function Loading() {
  return (
    <Column gap={10}>
      <Skeleton height={25} />
      <Skeleton height={25} />
      <Skeleton height={25} />
    </Column>
  )
}
