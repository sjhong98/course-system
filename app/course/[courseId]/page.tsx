import { Suspense } from 'react'
import CourseDetailContainer from '@/features/course/components/CourseDetailContainer'
import PageTitle from '@/shared/components/ui/PageTitle'
import Loading from '@/shared/components/ui/Loading'

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  return (
    <>
      <PageTitle title="강의 상세" />
      <Suspense fallback={<Loading />}>
        <CourseDetailContainer params={params} />
      </Suspense>
    </>
  )
}
