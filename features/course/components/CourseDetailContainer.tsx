import { getCourse } from '@/action/getCourse'
import CourseDetail from './CourseDetail'
import { ApiError } from '@/shared/libs/api/api'

interface CourseDetailContainerProps {
  courseId: string
}

export default async function CourseDetailContainer({ courseId }: CourseDetailContainerProps) {
  let course = null
  let errorMessage: string | null = null

  try {
    course = await getCourse(Number(courseId))
  } catch (error) {
    errorMessage = error instanceof ApiError ? error.message : '강의 조회 중 오류가 발생했습니다.'
  }

  return <CourseDetail course={course} errorMessage={errorMessage} />
}
