'use server'

import CourseCreateForm from '@/features/course/components/CourseCreateForm'
import Column from '@/shared/components/flexBox/Column'
import PageTitle from '@/shared/components/ui/PageTitle'

export default async function CourseCreate() {
  return (
    <Column gap={20}>
      <PageTitle title="강의 등록" />
      <CourseCreateForm />
    </Column>
  )
}
