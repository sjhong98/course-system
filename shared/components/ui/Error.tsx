import { useRouter } from 'next/navigation'
import Column from '../flexBox/Column'
import Button from './Button'

type ErrorProps = {
  message?: string
  buttonText?: string
  retry?: () => void
}

export default function Error({ message = '오류가 발생했습니다.', buttonText = '다시 시도', retry }: ErrorProps) {
  const router = useRouter()
  let retryFunction = retry ?? router.refresh
  return (
    <Column gap={20} className="w-full h-full items-center justify-center">
      <h2 className="text-lg">{message}</h2>
      <Button onClick={retryFunction}>{buttonText}</Button>
    </Column>
  )
}
