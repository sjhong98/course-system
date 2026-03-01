import { redirect } from 'next/navigation'

import { UNAUTHORIZED_REDIRECT_URL } from '@/shared/libs/constants/constants'

export default async function Home() {
  redirect(UNAUTHORIZED_REDIRECT_URL)
}
