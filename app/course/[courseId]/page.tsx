import CourseDetailContainer from '@/features/course/components/CourseDetailContainer'
import CourseDetailSkeleton from '@/features/course/components/CourseDetailSkeleton'
import { Suspense } from 'react'

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  return (
    <>
      <Suspense fallback={<CourseDetailSkeleton />}>
        <CourseDetailContainer params={params} />
      </Suspense>
    </>
  )
}
