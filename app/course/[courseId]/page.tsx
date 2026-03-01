import { Suspense } from 'react'

import CourseDetailContainer from '@/features/course/components/CourseDetailContainer'
import CourseDetailSkeleton from '@/features/course/components/CourseDetailSkeleton'

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  return (
    <>
      <Suspense fallback={<CourseDetailSkeleton />}>
        <CourseDetailContainer params={params} />
      </Suspense>
    </>
  )
}
