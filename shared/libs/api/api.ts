import type { paths } from '@/shared/libs/api/scheme.d'
import createClient from 'openapi-fetch'

export const api = createClient<paths>({
  baseUrl: 'http://localhost:8080',
})

type SuccessResponse<T> = {
  data?: T
  response: Response
}

type ErrorResponse = {
  error: { message: string }
  response: Response
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

export const unwrapApiResponse = async <T>(apiCall: () => Promise<SuccessResponse<T> | ErrorResponse>): Promise<T> => {
  const result = await apiCall()

  if ('error' in result) {
    // if (result.status === 401)
    throw new ApiError(result.error.message, result.response.status)
  }

  return result.data as T
}

// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'

// import { ApiError, unwrapApiResponse } from '@/shared/libs/api/api'

// export async function unwrapApiResponseOrRedirect<T>(
//   apiCall: () => Promise<{ data?: T; error?: { message?: string } | unknown; response?: Response }>,
// ): Promise<T> {
//   try {
//     return await unwrapApiResponse(apiCall)
//   } catch (error) {
//     if (error instanceof ApiError && error.status === 401) {
//       const cookieStore = await cookies()
//       cookieStore.delete('accessToken')
//       redirect('/signin')
//     }
//     throw error
//   }
// }
