'use server'

import { cookies } from 'next/headers'
import { api } from '@/shared/libs/api/api'

const ENROLL_COURSE_BATCH_PATH = '/api/enrollments/batch'

export const enrollCourseBatch = async (courseIds: number[]) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  return api.POST(ENROLL_COURSE_BATCH_PATH, {
    body: {
      courseIds,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
