'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { enrollCourse } from '@/action/enrollCourse'
import { getCourse } from '@/action/getCourse'
import { paths } from '@/shared/libs/api/scheme'
import { apiResponseHandler, apiSyncResponseHandler } from '@/shared/libs/utils/apiResponseHandler'
import { errorHandler } from '@/shared/libs/utils/errorHandler'
import { useQueryClient } from '@tanstack/react-query'

type Course = paths['/api/courses/{courseId}']['get']['responses']['200']['content']['*/*']

export function useCourseDetail(result: Awaited<ReturnType<typeof getCourse>>) {
  const queryClient = useQueryClient()
  const [course, setCourse] = useState<Course | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    try {
      const courseResult = apiSyncResponseHandler(result)
      setCourse(courseResult)
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
    }
  }, [result])

  const handleEnroll = useCallback(async () => {
    const toastId = 'enroll-course'
    try {
      if (!course || !course.id) {
        errorHandler(new Error('강의 ID가 올바르지 않습니다.'), { message: '강의 ID가 올바르지 않습니다.' })
        return
      }
      setProcessing(true)
      const enrollResult = await apiResponseHandler(async () => await enrollCourse(course.id ?? 0), { key: toastId })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              currentStudents: prev.currentStudents ?? 0 + 1,
              isFull: (prev?.currentStudents ?? 0) + 1 >= (prev?.maxStudents ?? 0),
            }
          : null,
      )
      if (enrollResult) {
        toast.success('수강 신청이 완료되었습니다.')
      }
    } catch (err) {
      errorHandler(err, { key: toastId, message: '수강 신청에 실패했습니다.' })
    } finally {
      setProcessing(false)
    }
  }, [course, queryClient])

  return {
    course,
    error,
    processing,
    handleEnroll,
  }
}
