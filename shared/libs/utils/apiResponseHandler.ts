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

// Client에서 동작하는 API 호출 및 응답값 핸들러
export const apiResponseHandler = async <T, E extends ErrorWithMessage>(
  apiCall: () => Promise<SerializableResponse<T, E>>,
  option?: { key?: string },
): Promise<T> => {
  const result = await apiCall()
  const { key } = option ?? {}

  if ('error' in result) {
    const toastMessage = result.error.message ?? '요청 중에 오류가 발생했습니다.'
    toast.error(toastMessage, { toastId: key ? key : toastMessage })

    if (result.status === 401 && result.error.message === '인증이 필요합니다') {
      window.location.href = '/signin'
      localStorage.removeItem('role')
      localStorage.removeItem('name')
    }

    throw new Error(result.error.message ?? '요청 중에 오류가 발생했습니다.')
  }

  return result.data as T
}

// Server에서 패치한 데이터를 Client에서 받아 동작하는 응답값 핸들러
export const apiSyncResponseHandler = <T, E extends ErrorWithMessage>(
  apiResponse: SerializableResponse<T, E>,
  option?: { key?: string },
): T => {
  const { key } = option ?? {}
  if ('error' in apiResponse) {
    const toastMessage = apiResponse.error.message ?? '요청 중에 오류가 발생했습니다.'
    toast.error(toastMessage, { toastId: key ? key : toastMessage })

    if (apiResponse.status === 401) {
      window.location.href = '/signin'
      localStorage.removeItem('role')
      localStorage.removeItem('name')
    }

    throw new Error(apiResponse.error.message)
  }

  return apiResponse.data as T
}
