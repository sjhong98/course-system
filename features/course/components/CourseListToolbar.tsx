'use client'

import Row from '@/shared/components/flexBox/Row'
import Button from '@/shared/components/ui/Button'
import CheckBox from '@/shared/components/ui/CheckBox'
import { useQueryParams } from '@/shared/hooks/useQueryParams'
import { PAGE_TITLE_HEIGHT } from '@/shared/libs/constants/constants'
import { cn } from '@/shared/libs/utils/cn'
import { FilterIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useEffect, useMemo, useState } from 'react'

export type CourseListSort = 'recent' | 'popular' | 'rate'

type CourseHeaderButtonProps = {
  children: ReactNode
  onClick: () => void
  active?: boolean
  'aria-label'?: string
}

function CourseHeaderButton({ children, onClick, active, 'aria-label': ariaLabel, ...rest }: CourseHeaderButtonProps) {
  return (
    <Button
      className={cn(
        'p-1 px-1.5 text-sm whitespace-nowrap ',
        active
          ? '!bg-[var(--foreground)] !text-[var(--background-tertiary)]'
          : '!bg-[var(--background-tertiary)] !text-[var(--foreground)]',
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default function CourseListToolbar() {
  const router = useRouter()
  const { setParam } = useQueryParams()
  const searchParams = useSearchParams()
  const sort: CourseListSort = ['recent', 'popular', 'rate'].includes(searchParams.get('sort') ?? '')
    ? (searchParams.get('sort') as CourseListSort)
    : 'recent'
  const isSelectable = searchParams.get('select') === 'true'

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isInstructor, setIsInstructor] = useState(false)

  const handleSortChange = (value: CourseListSort) => {
    setParam('sort', value)
  }

  const handleSelectChange = () => {
    setParam('select', !isSelectable ? 'true' : null)
  }

  const sortList = useMemo(
    () => [
      { label: '최근 등록순', value: 'recent' },
      { label: '신청자 많은순', value: 'popular' },
      { label: '신청률 높은순', value: 'rate' },
    ],
    [],
  )

  useEffect(() => {
    setIsInstructor(typeof window !== 'undefined' && window.localStorage.getItem('role') === 'INSTRUCTOR')
  }, [])

  return (
    <>
      <Row gap={4} className="absolute top-2 right-0" role="toolbar" aria-label="강의 목록 도구">
        <CourseHeaderButton onClick={() => setIsFilterOpen(!isFilterOpen)} active={isFilterOpen} aria-label="정렬 필터">
          <FilterIcon className="w-4 h-4" />
        </CourseHeaderButton>
        <CourseHeaderButton onClick={handleSelectChange} active={isSelectable} aria-label="수강 신청 선택">
          수강 신청 선택
        </CourseHeaderButton>
        {isInstructor && (
          <CourseHeaderButton onClick={() => router.push('/course/create')} active aria-label="강의 개설">
            강의 개설
          </CourseHeaderButton>
        )}
      </Row>
      {isFilterOpen && (
        <Row
          as="section"
          role="group"
          aria-label="정렬 옵션"
          className="absolute right-0 w-full py-2 bg-[var(--background)] z-[90] border-b border-[var(--background-tertiary)]"
          style={{ top: `${PAGE_TITLE_HEIGHT}px` }}
        >
          {sortList.map((item) => (
            <CheckBox
              key={item.value}
              label={item.label}
              className="flex-1"
              checked={sort === item.value}
              onChange={() => handleSortChange(item.value as CourseListSort)}
              aria-label={item.label}
            />
          ))}
        </Row>
      )}
    </>
  )
}
