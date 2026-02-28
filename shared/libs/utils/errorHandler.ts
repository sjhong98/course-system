import { toast } from 'react-toastify'

export const errorHandler = async (error: Error | unknown, option?: { key?: string; message?: string }) => {
  if (error instanceof Error) {
    const { key, message } = option ?? {}
    const displayMessage = message ?? error?.message ?? '요청 중에 오류가 발생했습니다.'
    console.error(error?.message ?? displayMessage)
    toast.error(displayMessage, { toastId: key ?? displayMessage })
  }
}
