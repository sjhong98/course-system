'use client'

import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { enrollCourse } from '@/action/enrollCourse'
import { getCourse } from '@/action/getCourse'
import PaddingHorizontalOverrideContainer from '@/shared/components/container/PaddingHorizontalOverrideContainer'
import Column from '@/shared/components/flexBox/Column'
import Row from '@/shared/components/flexBox/Row'
import { BottomButton } from '@/shared/components/ui/BottomButton'
import Error from '@/shared/components/ui/Error'
import { paths } from '@/shared/libs/api/scheme'
import { apiResponseHandler, apiSyncResponseHandler } from '@/shared/libs/utils/apiResponseHandler'
import { cn } from '@/shared/libs/utils/cn'
import { errorHandler } from '@/shared/libs/utils/errorHandler'
import { useQueryClient } from '@tanstack/react-query'

export default function CourseDetail({ result }: { result: Awaited<ReturnType<typeof getCourse>> }) {
  const queryClient = useQueryClient()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string>(null)
  const [course, setCourse] = useState<paths['/api/courses/{courseId}']['get']['responses']['200']['content']['*/*']>(null)

  useEffect(() => {
    try {
      const courseResult = apiSyncResponseHandler(result)
      setCourse(courseResult)
    } catch (error) {
      setError(error.message)
    }
  }, [result])

  const handleEnroll = useCallback(async () => {
    const toastId = 'enroll-course'
    try {
      if (!course) return
      setProcessing(true)
      const result = await apiResponseHandler(async () => await enrollCourse(course.id!), { key: toastId })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setCourse((prev) => ({
        ...prev,
        currentStudents: prev.currentStudents + 1,
        isFull: prev.currentStudents + 1 >= prev.maxStudents,
      }))

      if (result) {
        toast.success('수강 신청이 완료되었습니다.')
      }
    } catch (error) {
      errorHandler(error, { key: toastId, message: '수강 신청에 실패했습니다.' })
    } finally {
      setProcessing(false)
    }
  }, [course, queryClient])

  return error ? (
    <Error message={error} />
  ) : !course ? (
    <></>
  ) : (
    <Column gap={12} className="w-full h-full">
      <PaddingHorizontalOverrideContainer paddingHorizontal className="bg-[var(--background-tertiary)] py-6 flex flex-col gap-8">
        <Column gap={4}>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-sm text-gray-500">{course.description}</p>
        </Column>
        <Row className="w-full justify-between">
          <p className="text-sm">강사 {course.instructorName}</p>
          <p className="text-sm text-gray-500">{dayjs(course.createdAt).format('M월 D일')} 등록됨</p>
        </Row>
      </PaddingHorizontalOverrideContainer>
      <Column gap={6} className="w-full items-end">
        <p className={cn('text-2xl font-bold', course.isFull ? 'opacity-30' : '')}>{course.price?.toLocaleString()}원</p>
        {course.isFull ? (
          <Column>
            <p>정원 마감</p>
          </Column>
        ) : (
          <p>{course.availableSeats}개 남았습니다.</p>
        )}
      </Column>

      <BottomButton.Container>
        <BottomButton.Button disabled={course.isFull} processing={processing} onClick={handleEnroll} aria-label="수강 신청">
          수강 신청
        </BottomButton.Button>
      </BottomButton.Container>
    </Column>
  )
}
