'use server'

import { cookies } from 'next/headers'

import { api, serializableResponse } from '@/shared/libs/api/api'
import { ApiRequest } from '@/shared/libs/utils/typeGenerator'

type CourseCreateForm = ApiRequest<'/api/courses', 'post'>

// 강의 개설 액션

export async function createCourse(course: CourseCreateForm) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  return serializableResponse(() =>
    api.POST('/api/courses', {
      body: course,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  )
}
