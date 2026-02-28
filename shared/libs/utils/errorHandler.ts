import { toast } from 'react-toastify'

export const errorHandler = async (error: Error, message?: string) => {
  const toastMessage = error.message ?? message ?? '요청 중에 오류가 발생했습니다.'
  toast.error(toastMessage, { toastId: toastMessage })
}
