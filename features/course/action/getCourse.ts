'use server'

import { api, serializableResponse } from '@/shared/libs/api/api'

const GET_COURSE_PATH = '/api/courses/{courseId}'

// 강의 상세 조회 액션

export async function getCourse(courseId: number) {
  return serializableResponse(() =>
    api.GET(GET_COURSE_PATH, {
      params: {
        path: {
          courseId,
        },
      },
    }),
  )
}
