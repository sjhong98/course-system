'use client'

import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'

import { useEnrollCourseBatch } from '@/features/course/hooks/useEnrollCourse'
import { courseListQueryOptions } from '@/features/course/query/courseQuery'
import { parseCourseListSort } from '@/features/course/utils/parseCourseListSort'
import { useQueryParams } from '@/shared/hooks/useQueryParams'
import { paths } from '@/shared/libs/api/scheme'

type CourseItem = paths['/api/courses/{courseId}']['get']['responses']['200']['content']['*/*']

// 강의 목록 도메인 로직 훅

export function useCourseList() {
  const router = useRouter()
  const { setParam } = useQueryParams()
  const searchParams = useSearchParams()
  const sort = parseCourseListSort(searchParams)
  const isSelectable = searchParams.get('select') === 'true'

  const { ref: upperTriggerRef, inView: upperInView } = useInView()
  const { ref: lowerTriggerRef, inView: lowerInView } = useInView()

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

  // 강의 목록 데이터 설정
  const courseList = useMemo(() => {
    if (!courseListData) return []
    const list: CourseItem[] = courseListData.pages.flatMap((page) => page?.content ?? []) ?? []
    const uniqueById = new Map<number, CourseItem>()
    for (const item of list) {
      if (!item) continue
      if ('id' in item) {
        uniqueById.set(item.id ?? 0, item)
      }
    }
    return Array.from(uniqueById.values())
  }, [courseListData])

  // 수강 신청 도메인 로직 훅
  const { enrollCourseList, handleEnrollCourseChange, handleEnrollCourse, processing } = useEnrollCourseBatch({
    courseList,
    sort,
    setParam,
  })

  // 무한 스크롤 핸들러
  useEffect(() => {
    if ((upperInView || lowerInView) && hasNextPageCourseList) {
      fetchNextPageCourseList()
    }
  }, [upperInView, lowerInView, hasNextPageCourseList, fetchNextPageCourseList])

  // 강의 아이템 클릭 핸들러
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
