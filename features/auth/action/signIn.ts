'use server'

import { cookies } from 'next/headers'

import { api, serializableResponse } from '@/shared/libs/api/api'
import { ApiRequest, ApiResponse } from '@/shared/libs/utils/typeGenerator'

const LOGIN_PATH = '/api/users/login'

// 로그인 액션

export async function signIn(signInForm: ApiRequest<typeof LOGIN_PATH, 'post'>) {
  const result = await serializableResponse(() => api.POST(LOGIN_PATH, { body: signInForm }))

  if ('error' in result) return result

  const { accessToken } = result.data as ApiResponse<typeof LOGIN_PATH, 'post'>
  if (accessToken) {
    const cookieStore = await cookies()
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
    })
  }

  return result
}
