'use server'

import { api, unwrapApiResponse } from '@/shared/libs/api/api'

const GET_COURSE_PATH = '/api/courses/{courseId}'

export async function getCourse(courseId: number) {
  return unwrapApiResponse(async () => {
    return api.GET(GET_COURSE_PATH, {
      params: {
        path: {
          courseId,
        },
      },
    })
  })
}
