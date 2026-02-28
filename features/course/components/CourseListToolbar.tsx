'use client'

import Row from '@/shared/components/flexBox/Row'
import Button from '@/shared/components/ui/Button'
import CheckBox from '@/shared/components/ui/CheckBox'
import { useQueryParams } from '@/shared/hooks/useQueryParams'
import { PAGE_TITLE_HEIGHT } from '@/shared/libs/constants/constants'
import { cn } from '@/shared/libs/utils/cn'
import { FilterIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useMemo, useState } from 'react'

export type CourseListSort = 'recent' | 'popular' | 'rate'

type CourseHeaderButtonProps = {
  children: ReactNode
  onClick: () => void
  active?: boolean
}

function CourseHeaderButton({ children, onClick, active }: CourseHeaderButtonProps) {
  return (
    <Button
      className={cn(
        'p-1 px-1.5 text-sm whitespace-nowrap ',
        active
          ? '!bg-[var(--foreground)] !text-[var(--background-tertiary)]'
          : '!bg-[var(--background-tertiary)] !text-[var(--foreground)]',
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export default function CourseListToolbar() {
  const router = useRouter()
  const { setParam } = useQueryParams()
  const searchParams = useSearchParams()
  const sort = (searchParams.get('sort') as CourseListSort) ?? 'recent'
  const isSelectable = searchParams.get('select') === 'true'

  const [isFilterOpen, setIsFilterOpen] = useState(false)

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

  return (
    <>
      <Row gap={4} className="absolute top-2 right-0">
        <CourseHeaderButton onClick={() => setIsFilterOpen(!isFilterOpen)} active={isFilterOpen}>
          <FilterIcon className="w-4 h-4" />
        </CourseHeaderButton>
        <CourseHeaderButton onClick={handleSelectChange} active={isSelectable}>
          수강 신청
        </CourseHeaderButton>
        <CourseHeaderButton onClick={() => router.push('/course/create')} active>
          강의 개설
        </CourseHeaderButton>
      </Row>
      {isFilterOpen && (
        <Row
          className="absolute right-0 w-full py-2 bg-[var(--background)] z-[100] border-b border-[var(--background-tertiary)]"
          style={{ top: `${PAGE_TITLE_HEIGHT}px` }}
        >
          {sortList.map((item) => (
            <CheckBox
              key={item.value}
              label={item.label}
              className="flex-1"
              checked={sort === item.value}
              onChange={() => handleSortChange(item.value as CourseListSort)}
            />
          ))}
        </Row>
      )}
    </>
  )
}
