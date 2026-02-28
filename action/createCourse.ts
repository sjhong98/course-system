'use server'

import { cookies } from 'next/headers'

import { api } from '@/shared/libs/api/api'
import { ApiRequest } from '@/shared/libs/utils/typeGenerator'

type CourseCreateForm = ApiRequest<'/api/courses', 'post'>

export async function createCourse(course: CourseCreateForm) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  return api.POST('/api/courses', {
    body: course,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
