import { toast } from 'react-toastify'
import { SerializableResponse } from '../api/api'
import { errorHandler } from './errorHandler'

export type ApiErrorPayload = { message: string; status: number }

type ErrorWithMessage = { message?: string }

// Client에서 동작하는 API 호출 및 응답값 핸들러
export const apiResponseHandler = async <T, E extends ErrorWithMessage>(
  apiCall: () => Promise<SerializableResponse<T, E>>,
  option?: { key?: string },
): Promise<T> => {
  try {
    const result = await apiCall()
    return responseErrorHandler(result, option)
  } catch (error) {
    await errorHandler(error)
    throw error
  }
}

// Server에서 패치한 데이터를 Client에서 받아 동작하는 응답값 핸들러
export const apiSyncResponseHandler = <T, E extends ErrorWithMessage>(
  apiResponse: SerializableResponse<T, E>,
  option?: { key?: string },
): T => {
  return responseErrorHandler(apiResponse, option)
}

const responseErrorHandler = <T, E extends ErrorWithMessage>(apiResponse: SerializableResponse<T, E>, option?: { key?: string }) => {
  const { key } = option ?? {}

  if ('error' in apiResponse) {
    const toastMessage = apiResponse.error.message ?? '요청 중에 오류가 발생했습니다.'
    toast.error(toastMessage, { toastId: key ? key : toastMessage })

    if (apiResponse.status === 401 && apiResponse.error.message === '인증이 필요합니다') {
      window.location.href = '/signin'
      localStorage.removeItem('role')
      localStorage.removeItem('name')
    }

    throw new Error(apiResponse.error.message ?? '요청 중에 오류가 발생했습니다.')
  }

  return apiResponse.data as T
}
