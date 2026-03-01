'use client'

import { Fragment } from 'react'

import CourseListSkeleton from '@/features/course/components/CourseListSkeleton'
import { useCourseList } from '@/features/course/hooks/useCourseList'
import Column from '@/shared/components/flexBox/Column'
import Row from '@/shared/components/flexBox/Row'
import { BottomButton } from '@/shared/components/ui/BottomButton'
import { SelectableList } from '@/shared/components/ui/SelectableList'
import Error from '@/shared/components/ui/Error'
import { HEADER_HEIGHT, PAGE_TITLE_HEIGHT } from '@/shared/libs/constants/constants'
import { cn } from '@/shared/libs/utils/cn'

const COURSE_LIST_HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px - ${PAGE_TITLE_HEIGHT}px)`

// 강의 목록 컴포넌트

export default function CourseList() {
  const {
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
    handleClickCourseItem,
    handleEnrollCourse,
    isSelectable,
  } = useCourseList()

  if (isRetrying) {
    return <Error message={errorCourseList?.message} />
  }

  if (!Array.isArray(courseList)) return null

  return (
    <Column gap={20} style={{ height: COURSE_LIST_HEIGHT, maxHeight: COURSE_LIST_HEIGHT }}>
      <SelectableList.Container
        aria-label="강의 목록"
        className={cn('overflow-y-scroll pb-[100px] flex-shrink-0 h-full relative')}
        style={{ marginRight: 'calc(var(--scrollbar-width) * -1)' }}
      >
        {courseList.map((item, index) => {
          if (item === undefined) return null
          return (
            <Fragment key={item.id}>
              {index === courseList.length - 4 && <div key={-1} ref={upperTriggerRef} className="w-full h-1" />}
              <SelectableList.Item
                selected={enrollCourseList.includes(item.id ?? 0)}
                selectable={isSelectable}
                disabled={isSelectable && item.isFull}
                onSelect={() => handleClickCourseItem(item.id ?? 0)}
                aria-label={item.title ? `강의: ${item.title}` : undefined}
              >
                <Column
                  gap={10}
                  className={cn('w-full h-full border border-neutral-300 rounded-lg p-2 select-none', item.isFull ? 'opacity-30' : '')}
                >
                  <Row className="w-full justify-between">
                    <Column>
                      <p className="line-clamp-1">{item.title}</p>
                      <p className="text-[12px] text-neutral-500 line-clamp-1">{item.description}</p>
                    </Column>
                    <p>{Number(item.price)?.toLocaleString()}원</p>
                  </Row>
                  <Row className="w-full justify-between">
                    <p>강사 {item.instructorName}</p>
                    <p>
                      수강인원&nbsp;&nbsp;{item.currentStudents} / {item.maxStudents}
                    </p>
                  </Row>
                </Column>
              </SelectableList.Item>
            </Fragment>
          )
        })}
        <div key={-1} ref={lowerTriggerRef} className="w-full h-5" />
        {isFetchingNextPageCourseList && <CourseListSkeleton />}
        {!hasNextPageCourseList && !isFetchingCourseList && (
          <Row className="w-full justify-center items-center h-[80px]">
            <p className="text-sm">모든 강의를 불러왔습니다.</p>
          </Row>
        )}
      </SelectableList.Container>
      {isSelectable && (
        <BottomButton.Container>
          <BottomButton.Button
            onClick={handleEnrollCourse}
            processing={processing}
            disabled={enrollCourseList.length === 0}
            aria-label="수강 신청"
          >
            수강 신청
          </BottomButton.Button>
        </BottomButton.Container>
      )}
    </Column>
  )
}
