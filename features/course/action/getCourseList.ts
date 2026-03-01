'use server'

import { cookies } from 'next/headers'

import { api, serializableResponse } from '@/shared/libs/api/api'

const GET_COURSES_PATH = '/api/courses'

// 강의 목록 조회 액션

export async function getCourseList(page: number, sort?: string) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  return serializableResponse(() =>
    api.GET(GET_COURSES_PATH, {
      params: {
        query: {
          page,
          sort,
        },
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  )
}
