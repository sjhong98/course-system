'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import { useEnrollCourse } from '@/features/course/hooks/useEnrollCourse'
import { paths } from '@/shared/libs/api/scheme'

export type Course = paths['/api/courses/{courseId}']['get']['responses']['200']['content']['*/*']

// 강의 상세 도메인 로직 훅

export function useCourseDetail(course: Course | null) {
  const router = useRouter()

  const { handleEnroll: enroll, processing } = useEnrollCourse(course?.id ?? undefined)

  // 수강 신청 핸들러
  const handleEnroll = useCallback(() => {
    enroll(() => {
      router.refresh()
    })
  }, [enroll])

  return {
    processing,
    handleEnroll,
  }
}
