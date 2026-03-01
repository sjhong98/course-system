'use server'

import { cookies } from 'next/headers'

// 로그아웃 액션

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
}
