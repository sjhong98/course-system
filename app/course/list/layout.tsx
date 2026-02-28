import { Suspense } from 'react'

import Column from '@/shared/components/flexBox/Column'
import Loading from '@/shared/components/ui/Loading'
import PageTitle from '@/shared/components/ui/PageTitle'
import { PAGE_HEIGHT } from '@/shared/libs/constants/constants'

export default function CourseListLayout({ children }: { children: React.ReactNode }) {
  return (
    <Column className="relative" style={{ height: PAGE_HEIGHT, maxHeight: PAGE_HEIGHT }}>
      <PageTitle title="강의 목록" />
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </Column>
  )
}
