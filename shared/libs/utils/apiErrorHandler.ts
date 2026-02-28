import { toast } from 'react-toastify'
import { ApiError } from '../api/api'

export const apiErrorHandler = (error: Error, message?: string) => {
  if (error instanceof ApiError) {
    console.log(error)
    toast.error(error.message ?? message ?? '요청 중에 오류가 발생했습니다.')
  }
}
