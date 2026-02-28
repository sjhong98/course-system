import { getCourse } from '@/action/getCourse'
import CourseDetail from './CourseDetail'

interface CourseDetailContainerProps {
  params: Promise<{ courseId: string }>
}

export default async function CourseDetailContainer({ params }: CourseDetailContainerProps) {
  const { courseId } = await params

  const result: Awaited<ReturnType<typeof getCourse>> = await getCourse(Number(courseId))

  return <CourseDetail result={result} />
}
