import { toast } from 'react-toastify'

import { signOut } from '@/features/auth/action/signOut'
import { SerializableResponse } from '@/shared/libs/api/api'
import { errorHandler } from '@/shared/libs/utils/errorHandler'

import { API_ERROR_MESSAGE, UNAUTHORIZED_MESSAGE, UNAUTHORIZED_REDIRECT_URL } from '../constants/constants'

export type ApiErrorPayload = { message: string; status: number }

type ErrorLike = { message?: string } | undefined

// apiResponseHandler: 비동기 API 호출 함수를 인자로 받아, 호출한 뒤 반환된 응답을 풀고, 에러 시 에러 핸들러를 호출.
// apiSyncResponseHandler: 이미 서버 등에서 가져온 직렬화된 응답 객체를 인자로 받아, 별도 호출 없이 그 응답만 풀고, 에러 시 에러 핸들러를 호출.

export const apiResponseHandler = async <T, E extends ErrorLike>(
  apiCall: () => Promise<SerializableResponse<T, E>>,
  option?: { key?: string },
): Promise<T> => {
  try {
    const result = await apiCall()
    return unwrapApiResponse(result, option)
  } catch (error) {
    await errorHandler(error, { key: option?.key })
    throw error
  }
}

export const apiSyncResponseHandler = <T, E extends ErrorLike>(
  apiResponse: SerializableResponse<T, E>,
  option?: { key?: string; skipToast?: boolean },
): T => {
  return unwrapApiResponse(apiResponse, option)
}

const unwrapApiResponse = <T, E extends ErrorLike>(
  apiResponse: SerializableResponse<T, E>,
  option?: { key?: string; skipToast?: boolean },
) => {
  const { key, skipToast } = option ?? {}

  if ('error' in apiResponse) {
    const toastMessage = apiResponse.error?.message ?? API_ERROR_MESSAGE
    if (!skipToast) {
      toast.error(toastMessage, { toastId: key ? key : toastMessage })
    }

    if (apiResponse.status === 401 && apiResponse.error?.message === UNAUTHORIZED_MESSAGE) {
      window.location.href = UNAUTHORIZED_REDIRECT_URL
      localStorage.removeItem('role')
      localStorage.removeItem('name')
      signOut()
    }

    throw new Error(apiResponse.error?.message ?? API_ERROR_MESSAGE)
  }

  return apiResponse.data as T
}
