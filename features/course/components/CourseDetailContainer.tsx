import { getCourse } from '@/features/course/action/getCourse'
import CourseDetail from '@/features/course/components/CourseDetail'
import Error from '@/shared/components/ui/Error'
import { COURSE_ID_INVALID_MESSAGE } from '@/shared/libs/constants/constants'

interface CourseDetailContainerProps {
  params: Promise<{ courseId: string }>
}

// 강의 상세 컨테이너 컴포넌트 (서버)

export default async function CourseDetailContainer({ params }: CourseDetailContainerProps) {
  const { courseId } = await params

  const isNumber = !isNaN(Number(courseId)) && Number(courseId) > 0
  if (!isNumber) {
    return <Error message={COURSE_ID_INVALID_MESSAGE} />
  }

  const result: Awaited<ReturnType<typeof getCourse>> = await getCourse(Number(courseId))

  return <CourseDetail result={result} />
}
