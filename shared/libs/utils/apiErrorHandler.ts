import { toast } from 'react-toastify'
import { ApiError } from '../api/api'

export const apiErrorHandler = async (error: Error, message?: string) => {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      document.cookie = 'accessToken=; path=/; max-age=0'
      window.location.href = '/signin'
    } else {
      const toastMessage = error.message ?? message ?? '요청 중에 오류가 발생했습니다.'
      toast.error(toastMessage, { toastId: toastMessage })
    }
  }
}
