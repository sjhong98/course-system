import type { paths } from '@/shared/libs/api/scheme.d'
import createClient from 'openapi-fetch'

export const api = createClient<paths>({
  baseUrl: 'http://localhost:8080',
})

export const unwrapApiResponse = async <T>(apiCall: () => Promise<{ data?: T; error?: { message?: string } }>): Promise<T> => {
  const result = await apiCall()

  if (result.error) {
    console.log(result)
    throw new Error(result.error.message)
  }

  return result.data as T
}
