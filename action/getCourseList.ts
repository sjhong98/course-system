'use server'

import { cookies } from 'next/headers'

import { api, unwrapApiResponse } from '@/shared/libs/api/api'

const GET_COURSES_PATH = '/api/courses'

export async function getCourseList(page: number, sort?: string) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    return unwrapApiResponse(() =>
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
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw error
  }
}
