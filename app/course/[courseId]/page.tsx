import CourseDetailContainer from '@/features/course/components/CourseDetailContainer'
import Loading from '@/shared/components/ui/Loading'
import { Suspense } from 'react'

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <CourseDetailContainer params={params} />
      </Suspense>
    </>
  )
}
