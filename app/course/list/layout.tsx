import Column from '@/shared/components/flexBox/Column'
import PageTitle from '@/shared/components/ui/PageTitle'
import { PAGE_HEIGHT } from '@/shared/libs/constants/constants'

export default function CourseListLayout({ children }: { children: React.ReactNode }) {
  return (
    <Column className="relative" style={{ height: PAGE_HEIGHT, maxHeight: PAGE_HEIGHT }}>
      <PageTitle title="강의 목록" />
      {children}
    </Column>
  )
}
