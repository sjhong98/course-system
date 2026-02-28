import { getCourse } from '@/action/getCourse'
import CourseDetail from './CourseDetail'
import Error from '@/shared/components/ui/Error'

interface CourseDetailContainerProps {
  params: Promise<{ courseId: string }>
}

export default async function CourseDetailContainer({ params }: CourseDetailContainerProps) {
  const { courseId } = await params

  const isNumber = !isNaN(Number(courseId)) && Number(courseId) > 0
  if (!isNumber) {
    return <Error message="강의 ID가 올바르지 않습니다." />
  }

  const result: Awaited<ReturnType<typeof getCourse>> = await getCourse(Number(courseId))

  return <CourseDetail result={result} />
}
