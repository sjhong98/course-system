import { Suspense } from 'react'

import CourseListContainer from '@/features/course/components/CourseListContainer'
import CourseListSkeleton from '@/features/course/components/CourseListSkeleton'
import CourseListToolbar from '@/features/course/components/CourseListToolbar'

export default function CourseListPage() {
  return (
    <>
      <CourseListToolbar />
      <Suspense fallback={<CourseListSkeleton />}>
        <CourseListContainer />
      </Suspense>
    </>
  )
}
