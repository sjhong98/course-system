import type { paths } from '@/shared/libs/api/scheme.d'
import createClient from 'openapi-fetch'

export type SuccessResponse<T> = {
  data?: T
  response: Response
}

export type ErrorResponse = {
  error: { message: string }
  response: Response
}

export type ApiResponse<TPath extends keyof paths, TMethod extends keyof paths[TPath]> =
  | SuccessResponse<paths[TPath][TMethod]>
  | ErrorResponse

export const api = createClient<paths>({
  baseUrl: 'http://localhost:8080',
})

export type FetchResponseLike<T, E = { message: string }> =
  | { data?: T; error?: never; response: Response }
  | { data?: never; error: E; response: Response }

export type SerializableResponse<T, E = { message: string }> = { data?: T } | { error: E; status: number }

export async function serializableResponse<T, E = { message: string }>(
  apiCall: () => Promise<FetchResponseLike<T, E>>,
): Promise<SerializableResponse<T, E>> {
  const response = await apiCall()
  if ('error' in response && response.error) {
    return { error: response.error, status: response.response.status }
  }
  return { data: response.data as T }
}
