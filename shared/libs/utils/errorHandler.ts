import { toast } from 'react-toastify'

import { API_ERROR_MESSAGE } from '../constants/constants'

export const errorHandler = async (error: Error | unknown, option?: { key?: string; message?: string; callback?: () => void }) => {
  if (error instanceof Error) {
    const { key, message, callback } = option ?? {}
    const displayMessage = message ?? error?.message ?? API_ERROR_MESSAGE
    toast.error(displayMessage, { toastId: key ?? displayMessage })
    if (callback) {
      callback()
    }
  }
}
