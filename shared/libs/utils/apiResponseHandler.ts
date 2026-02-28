import { toast } from 'react-toastify'
import { SerializableResponse } from '@/shared/libs/api/api'
import { errorHandler } from '@/shared/libs/utils/errorHandler'

export type ApiErrorPayload = { message: string; status: number }

type ErrorLike = { message?: string } | undefined

// Client에서 동작하는 API 호출 및 응답값 핸들러
export const apiResponseHandler = async <T, E extends ErrorLike>(
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
export const apiSyncResponseHandler = <T, E extends ErrorLike>(
  apiResponse: SerializableResponse<T, E>,
  option?: { key?: string; skipToast?: boolean },
): T => {
  return responseErrorHandler(apiResponse, option)
}

const responseErrorHandler = <T, E extends ErrorLike>(
  apiResponse: SerializableResponse<T, E>,
  option?: { key?: string; skipToast?: boolean },
) => {
  const { key, skipToast } = option ?? {}

  if ('error' in apiResponse) {
    const toastMessage = apiResponse.error?.message ?? '요청 중에 오류가 발생했습니다.'
    if (!skipToast) {
      toast.error(toastMessage, { toastId: key ? key : toastMessage })
    }

    if (apiResponse.status === 401 && apiResponse.error?.message === '인증이 필요합니다') {
      window.location.href = '/signin'
      localStorage.removeItem('role')
      localStorage.removeItem('name')
    }

    throw new Error(apiResponse.error?.message ?? '요청 중에 오류가 발생했습니다.')
  }

  return apiResponse.data as T
}
