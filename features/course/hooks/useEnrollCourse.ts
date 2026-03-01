'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { enrollCourse } from '@/features/course/action/enrollCourse'
import { enrollCourseBatch } from '@/features/course/action/enrollCourseBatch'
import { courseListQueryOptions } from '@/features/course/query/courseQuery'
import { paths } from '@/shared/libs/api/scheme'
import {
  COURSE_ENROLL_BATCH_SUCCESS_MESSAGE,
  COURSE_ENROLL_ERROR_MESSAGE,
  COURSE_ENROLL_SUCCESS_MESSAGE,
  COURSE_ID_INVALID_MESSAGE,
} from '@/shared/libs/constants/constants'
import { apiResponseHandler } from '@/shared/libs/utils/apiResponseHandler'
import { errorHandler } from '@/shared/libs/utils/errorHandler'

type CourseItem = paths['/api/courses/{courseId}']['get']['responses']['200']['content']['*/*']

// 단일 강의 수강 신청 도메인 로직 훅

export function useEnrollCourse(courseId: number | undefined) {
  const queryClient = useQueryClient()
  const [processing, setProcessing] = useState(false)

  // 단일 강의 수강 신청 핸들러
  const handleEnroll = useCallback(
    async (onSuccess?: (courseId: number) => void) => {
      const toastId = 'enroll-course'
      try {
        if (courseId == null) {
          errorHandler(new Error(COURSE_ID_INVALID_MESSAGE), { message: COURSE_ID_INVALID_MESSAGE })
          return
        }
        setProcessing(true)
        const enrollResult = await apiResponseHandler(() => enrollCourse(courseId), { key: toastId })
        queryClient.invalidateQueries({ queryKey: ['courses'] })
        if (enrollResult) {
          toast.success(COURSE_ENROLL_SUCCESS_MESSAGE)
          onSuccess?.(courseId)
        }
      } catch (err) {
        errorHandler(err, { key: toastId, message: COURSE_ENROLL_ERROR_MESSAGE })
      } finally {
        setProcessing(false)
      }
    },
    [courseId, queryClient],
  )

  return { handleEnroll, processing }
}

export type UseEnrollCourseBatchOptions = {
  courseList: CourseItem[]
  sort: string
  setParam: (key: string, value: string | null) => void
}

// 일괄 수강 신청 도메인 로직 훅

export function useEnrollCourseBatch(options: UseEnrollCourseBatchOptions) {
  const { courseList, sort, setParam } = options
  const queryClient = useQueryClient()
  const [enrollCourseList, setEnrollCourseList] = useState<number[]>([])
  const [processing, setProcessing] = useState(false)

  // 수강 신청 선택 핸들러
  const handleEnrollCourseChange = useCallback((id: number) => {
    setEnrollCourseList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }
      return [...prev, id]
    })
  }, [])

  // 일괄 수강 신청 핸들러
  const handleEnrollCourse = useCallback(async () => {
    const toastId = 'enroll-course'
    try {
      setProcessing(true)
      const result = await apiResponseHandler(() => enrollCourseBatch(enrollCourseList), { key: toastId })
      setEnrollCourseList([])

      if (result.failed && result.failed.length > 0) {
        result.failed.forEach((item) => {
          const failedItemTitle = courseList.find((c) => c.id === item.courseId)?.title ?? 'invalid course id'
          toast.error(item.reason ? `${failedItemTitle}: ${item.reason}` : `${COURSE_ENROLL_ERROR_MESSAGE}: ${item.courseId}`)
        })
      }
      if (result.success && result.success.length > 0) {
        toast.success(`${COURSE_ENROLL_BATCH_SUCCESS_MESSAGE.replace('{count}', result.success.length.toString())}`)
        setParam('select', null)
        queryClient.setQueryData(courseListQueryOptions(sort).queryKey, (old) => {
          if (!old?.pages) return old
          return {
            ...old,
            pages: old.pages.map((page) => {
              const content = page.content ?? []
              return {
                ...page,
                content: content.map((item: CourseItem) => {
                  const successItem = result.success?.find((s) => s.courseId === item.id)
                  if (!successItem) return item
                  const currentStudents = (item.currentStudents ?? 0) + 1
                  const maxStudents = item.maxStudents ?? 0
                  const isFull = currentStudents >= maxStudents
                  return { ...item, currentStudents, isFull }
                }),
              }
            }),
          }
        })
      }
    } catch (err) {
      errorHandler(err, { key: toastId, message: COURSE_ENROLL_ERROR_MESSAGE })
    } finally {
      setProcessing(false)
    }
  }, [enrollCourseList, courseList, sort, setParam, queryClient])

  return {
    enrollCourseList,
    handleEnrollCourseChange,
    handleEnrollCourse,
    processing,
  }
}
