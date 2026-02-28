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
  const [course, setCourse] = useState<Course>(null)
  const [error, setError] = useState<string>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    try {
      const courseResult = apiSyncResponseHandler(result)
      setCourse(courseResult)
    } catch (err) {
      setError(err.message)
    }
  }, [result])

  const handleEnroll = useCallback(async () => {
    const toastId = 'enroll-course'
    try {
      if (!course) return
      setProcessing(true)
      const enrollResult = await apiResponseHandler(async () => await enrollCourse(course.id!), { key: toastId })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              currentStudents: prev.currentStudents + 1,
              isFull: prev.currentStudents + 1 >= prev.maxStudents,
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
