'use client'

import Column from '@/shared/components/flexBox/Column'
import Button from '@/shared/components/ui/Button'

type ErrorProps = {
  message?: string
  buttonText?: string
  retry?: () => void
}

// 공통 에러 UI 컴포넌트

export default function Error({ message = '오류가 발생했습니다.', buttonText = '다시 시도', retry }: ErrorProps) {
  let retryFunction = () => {
    if (retry) {
      retry()
    } else {
      window.location.reload()
    }
  }
  return (
    <Column as="section" role="alert" gap={20} className="w-full h-full items-center justify-center">
      <h2 className="text-lg">{message}</h2>
      <div className="w-[60%]">
        <Button onClick={retryFunction} aria-label={buttonText}>
          {buttonText}
        </Button>
      </div>
    </Column>
  )
}
