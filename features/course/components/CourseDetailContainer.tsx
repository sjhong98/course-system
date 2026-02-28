import { getCourse } from '@/action/getCourse'
import { ApiError, type ApiErrorPayload } from '@/shared/libs/api/api'
import CourseDetail from './CourseDetail'

interface CourseDetailContainerProps {
  params: Promise<{ courseId: string }>
}

export default async function CourseDetailContainer({ params }: CourseDetailContainerProps) {
  const { courseId } = await params
  let course = null
  let errorProp: ApiErrorPayload | null = null

  try {
    course = await getCourse(Number(courseId))
  } catch (error) {
    const err = error instanceof ApiError ? error : new ApiError('강의 조회 중 오류가 발생했습니다.', 500)
    errorProp = { message: err.message, status: err.status }
  }

  return <CourseDetail course={course} error={errorProp} />
}
