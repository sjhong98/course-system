'use client'

import { useQueryClient, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { toast } from 'react-toastify'

import { enrollCourseBatch } from '@/action/enrollCourseBatch'
import { courseListQueryOptions } from '@/features/course/query/courseQuery'
import { useQueryParams } from '@/shared/hooks/useQueryParams'
import { apiResponseHandler } from '@/shared/libs/utils/apiResponseHandler'
import { errorHandler } from '@/shared/libs/utils/errorHandler'
import { paths } from '@/shared/libs/api/scheme'
import { parseCourseListSort } from '../utils/parseCourseListSort'

export type CourseListSort = 'recent' | 'popular' | 'rate'

type CourseItem = paths['/api/courses/{courseId}']['get']['responses']['200']['content']['*/*']

export function useCourseList() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setParam } = useQueryParams()
  const searchParams = useSearchParams()
  const sort = parseCourseListSort(searchParams)
  const isSelectable = searchParams.get('select') === 'true'

  const { ref: upperTriggerRef, inView: upperInView } = useInView()
  const { ref: lowerTriggerRef, inView: lowerInView } = useInView()

  const [enrollCourseList, setEnrollCourseList] = useState<number[]>([])
  const [processing, setProcessing] = useState(false)

  const {
    data: courseListData,
    fetchNextPage: fetchNextPageCourseList,
    hasNextPage: hasNextPageCourseList,
    isFetching: isFetchingCourseList,
    isFetchingNextPage: isFetchingNextPageCourseList,
    error: errorCourseList,
    failureCount,
  } = useSuspenseInfiniteQuery(courseListQueryOptions(sort))

  const isRetrying = isFetchingCourseList && failureCount > 0

  const courseList = useMemo(() => {
    if (!courseListData) return []
    const list: CourseItem[] = courseListData.pages.flatMap((page) => page?.content) ?? []
    const uniqueById = new Map<number, CourseItem>()
    for (const item of list) {
      if (!item) continue
      if ('id' in item) {
        uniqueById.set(item.id, item)
      }
    }
    return Array.from(uniqueById.values())
  }, [courseListData])

  useEffect(() => {
    if ((upperInView || lowerInView) && hasNextPageCourseList) {
      fetchNextPageCourseList()
    }
  }, [upperInView, lowerInView, hasNextPageCourseList, fetchNextPageCourseList])

  const handleEnrollCourseChange = useCallback((id: number) => {
    setEnrollCourseList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }
      return [...prev, id]
    })
  }, [])

  const handleEnrollCourse = useCallback(async () => {
    const toastId = 'enroll-course'
    try {
      setProcessing(true)
      const result = await apiResponseHandler(async () => await enrollCourseBatch(enrollCourseList), { key: toastId })
      setEnrollCourseList([])

      if (result.failed && result.failed.length > 0) {
        result.failed.forEach((item) => {
          const failedItemTitle = courseList.find((c) => c.id === item.courseId)?.title ?? '알 수 없는 강의'
          toast.error(item.reason ? `${failedItemTitle}: ${item.reason}` : `강의 수강 신청에 실패했습니다: ${item.courseId}`)
        })
      }
      if (result.success && result.success.length > 0) {
        toast.success(`${result.success.length}개의 강의를 수강 신청했습니다.`)
        setParam('select', null)
        queryClient.setQueryData(courseListQueryOptions(sort).queryKey, (old) => {
          if (!old?.pages) return old
          return {
            ...old,
            pages: old.pages.map((page: { content: CourseItem[] }) => ({
              ...page,
              content: page.content.map((item: CourseItem) => {
                const successItem = result.success.find((s: { courseId: number }) => s.courseId === item.id)
                if (!successItem) return item
                const currentStudents = item.currentStudents + 1
                const isFull = currentStudents >= item.maxStudents
                return { ...item, currentStudents, isFull }
              }),
            })),
          }
        })
      }
    } catch (err) {
      errorHandler(err, { key: toastId, message: '수강 신청에 실패했습니다.' })
    } finally {
      setProcessing(false)
    }
  }, [enrollCourseList, courseList, sort, setParam, queryClient])

  const handleClickCourseItem = useCallback(
    (id: number) => {
      if (isSelectable) {
        handleEnrollCourseChange(id)
      } else {
        router.push(`/course/${id}`)
      }
    },
    [isSelectable, handleEnrollCourseChange, router],
  )

  return {
    courseList,
    upperTriggerRef,
    lowerTriggerRef,
    isFetchingNextPageCourseList,
    hasNextPageCourseList,
    isFetchingCourseList,
    isRetrying,
    errorCourseList,
    enrollCourseList,
    processing,
    handleEnrollCourseChange,
    handleEnrollCourse,
    handleClickCourseItem,
    isSelectable,
  }
}
