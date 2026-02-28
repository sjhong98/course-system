import type { paths } from '@/shared/libs/api/scheme.d'
import { redirect } from 'next/navigation'
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

export type ApiErrorPayload = { message: string; status: number }

const isClient = typeof window !== 'undefined'

export const unwrapApiResponse = async <T>(apiCall: () => Promise<SuccessResponse<T> | ErrorResponse>): Promise<T> => {
  const result = await apiCall()

  console.log('\n\n\nfrom api', result)

  if ('error' in result) {
    throw new ApiError(result.error.message, result.response.status)
  }

  return result.data as T
}
