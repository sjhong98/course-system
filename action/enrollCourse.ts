'use server'

import { cookies } from 'next/headers'

import { api, unwrapApiResponse } from '@/shared/libs/api/api'

const ENROLL_COURSE_PATH = '/api/courses/{courseId}/enroll'

export const enrollCourse = async (courseId: number) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  return unwrapApiResponse(async () => {
    return api.POST(ENROLL_COURSE_PATH, {
      params: {
        path: {
          courseId,
        },
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  })
}
