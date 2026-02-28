import CourseDetailContainer from '@/features/course/components/CourseDetailContainer'
import PageTitle from '@/shared/components/ui/PageTitle'

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  return (
    <>
      <PageTitle title="강의 상세" />
      <CourseDetailContainer courseId={params.courseId} />
    </>
  )
}
