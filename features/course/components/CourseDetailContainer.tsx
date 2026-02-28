import { getCourse } from '@/action/getCourse'
import CourseDetail from '@/features/course/components/CourseDetail'
import Error from '@/shared/components/ui/Error'

interface CourseDetailContainerProps {
  params: Promise<{ courseId: string }>
}

// 강의 상세 컨테이너 컴포넌트 (서버)

export default async function CourseDetailContainer({ params }: CourseDetailContainerProps) {
  const { courseId } = await params

  const isNumber = !isNaN(Number(courseId)) && Number(courseId) > 0
  if (!isNumber) {
    return <Error message="강의 ID가 올바르지 않습니다." />
  }

  const result: Awaited<ReturnType<typeof getCourse>> = await getCourse(Number(courseId))

  return <CourseDetail result={result} />
}
