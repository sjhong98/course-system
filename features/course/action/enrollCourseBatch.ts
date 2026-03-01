'use server'

import { cookies } from 'next/headers'

import { api, serializableResponse } from '@/shared/libs/api/api'

const ENROLL_COURSE_BATCH_PATH = '/api/enrollments/batch'

// 강의 수강 신청 배치 액션

export const enrollCourseBatch = async (courseIds: number[]) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  return serializableResponse(() =>
    api.POST(ENROLL_COURSE_BATCH_PATH, {
      body: {
        courseIds,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  )
}
