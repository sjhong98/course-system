'use server'

import { cookies } from 'next/headers'
import { api, serializableResponse } from '@/shared/libs/api/api'

const GET_COURSES_PATH = '/api/courses'

export async function getCourseList(page: number, sort?: string) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  return {
    error: {
      message: '값을 가져올 수 없습니다',
    },
    status: 400,
  }

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
