import { toast } from 'react-toastify'

export const errorHandler = async (error: Error, option?: { key?: string; message?: string }) => {
  const { key, message } = option ?? {}
  console.log(error.message ?? message ?? '요청 중에 오류가 발생했습니다.')
  toast.error(message, { toastId: key ? key : message })
}
