import { PAGE_TITLE_HEIGHT } from '@/shared/libs/constants/constants'
import { ChevronLeft } from 'lucide-react'
import Row from '../flexBox/Row'

type PageTitleProps = {
  title: string
  onBack?: () => void
}

export default function PageTitle({ title, onBack }: PageTitleProps) {
  return (
    <Row gap={10} className="items-center justify-start" style={{ height: `${PAGE_TITLE_HEIGHT}px` }}>
      {onBack && (
        <button type="button" className="flex items-center justify-center cursor-pointer" onClick={onBack} aria-label="뒤로 가기">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      <p className="text-lg font-semibold">{title}</p>
    </Row>
  )
}
