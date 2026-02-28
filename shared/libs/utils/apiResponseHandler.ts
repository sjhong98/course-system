import { toast } from 'react-toastify'
import { SerializableResponse } from '../api/api'

type SuccessResponse<T> = {
  data?: T
  response: Response
}

type ErrorResponse = {
  error: { message: string }
  response: Response
}

export type ApiErrorPayload = { message: string; status: number }

type ErrorWithMessage = { message?: string }

export const apiResponseHandler = async <T, E extends ErrorWithMessage>(apiCall: () => Promise<SerializableResponse<T, E>>): Promise<T> => {
  const result = await apiCall()

  if ('error' in result) {
    const toastMessage = result.error.message ?? '요청 중에 오류가 발생했습니다.'
    toast.error(toastMessage, { toastId: toastMessage })

    if (result.status === 401 && result.error.message === '인증이 필요합니다') {
      document.cookie = 'accessToken=; path=/; max-age=0'
      window.location.href = '/signin'
    }

    throw new Error(result.error.message ?? '요청 중에 오류가 발생했습니다.')
  }

  return result.data as T
}

export const apiSyncResponseHandler = <T>(apiResponse: SuccessResponse<T> | ErrorResponse): T => {
  if ('error' in apiResponse) {
    const toastMessage = apiResponse.error.message ?? '요청 중에 오류가 발생했습니다.'
    toast.error(toastMessage, { toastId: toastMessage })

    if (apiResponse.response.status === 401) {
      document.cookie = 'accessToken=; path=/; max-age=0'
      window.location.href = '/signin'
    }

    throw new Error(apiResponse.error.message)
  }

  return apiResponse.data as T
}
