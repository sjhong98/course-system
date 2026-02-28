import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'

import CourseList from '@/features/course/components/CourseList'
import { courseListQueryOptions } from '@/features/course/query/courseQuery'

const DEFAULT_SORT = 'recent'

// 강의 목록 컨테이너 컴포넌트 (서버)

export default async function CourseListContainer() {
  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery(courseListQueryOptions(DEFAULT_SORT))
  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <CourseList />
    </HydrationBoundary>
  )
}
