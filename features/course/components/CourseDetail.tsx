'use client'

import dayjs from 'dayjs'

import { getCourse } from '@/action/getCourse'
import PaddingHorizontalOverrideContainer from '@/shared/components/container/PaddingHorizontalOverrideContainer'
import Column from '@/shared/components/flexBox/Column'
import Row from '@/shared/components/flexBox/Row'
import { BottomButton } from '@/shared/components/ui/BottomButton'
import Error from '@/shared/components/ui/Error'
import { cn } from '@/shared/libs/utils/cn'

import { useCourseDetail } from '@/features/course/hooks/useCourseDetail'
import CourseDetailSkeleton from '@/features/course/components/CourseDetailSkeleton'
import { apiSyncResponseHandler } from '@/shared/libs/utils/apiResponseHandler'

// 강의 상세 컴포넌트

export default function CourseDetail({ result }: { result: Awaited<ReturnType<typeof getCourse>> }) {
  const course = apiSyncResponseHandler(result)
  const { error, processing, handleEnroll } = useCourseDetail(course)

  if (error) {
    return <Error message={error} />
  }

  if (!course) {
    return <CourseDetailSkeleton />
  }

  return (
    <Column as="article" gap={12} className="w-full h-full">
      <PaddingHorizontalOverrideContainer paddingHorizontal className="bg-[var(--background-tertiary)] py-6 flex flex-col gap-8">
        <Column gap={4}>
          <h1 className="text-3xl font-bold">{course?.title}</h1>
          <p className="text-sm text-gray-500">{course?.description}</p>
        </Column>
        <Row className="w-full justify-between">
          <p className="text-sm">강사 {course?.instructorName}</p>
          <p className="text-sm text-gray-500">{dayjs(course?.createdAt).format('M월 D일')} 등록됨</p>
        </Row>
      </PaddingHorizontalOverrideContainer>
      <Column gap={6} className="w-full items-end">
        <p className={cn('text-2xl font-bold', course?.isFull ? 'opacity-30' : '')}>{course?.price?.toLocaleString()}원</p>
        {course?.isFull ? (
          <Column>
            <p>정원 마감</p>
          </Column>
        ) : (
          <p>{course?.availableSeats}개 남았습니다.</p>
        )}
      </Column>

      <BottomButton.Container>
        <BottomButton.Button disabled={course?.isFull} processing={processing} onClick={handleEnroll} aria-label="수강 신청">
          수강 신청
        </BottomButton.Button>
      </BottomButton.Container>
    </Column>
  )
}
