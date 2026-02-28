'use client'

import { useCallback, useState } from 'react'

import { signIn } from '@/action/signIn'
import { validateSignInForm } from '@/features/auth/validation/signIn'
import useAuth from '@/shared/hooks/useAuth'
import { apiResponseHandler } from '@/shared/libs/utils/apiResponseHandler'
import { errorHandler } from '@/shared/libs/utils/errorHandler'
import type { InvalidResult } from '@/shared/validation/types'

export function useSignInForm() {
  const { completeSignIn } = useAuth()
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<InvalidResult | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      const toastId = 'sign-in'
      e.preventDefault()
      try {
        setProcessing(true)
        const result = validateSignInForm(signInForm)
        if (result.ok === false) {
          setError(result)
          return
        } else {
          setError(null)
        }
        const signInResult = await apiResponseHandler(() => signIn(signInForm), { key: toastId })
        const user = signInResult?.user
        if (!user?.role || !user?.name) {
          errorHandler(new Error('로그인 응답에 사용자 정보가 없습니다.'), { key: toastId, message: '로그인 응답에 사용자 정보가 없습니다. 다시 시도해 주세요.' })
          return
        }
        completeSignIn(user.role, user.name)
      } catch (err) {
        errorHandler(err, { key: toastId, message: '로그인 처리 중 오류가 발생했습니다.' })
      } finally {
        setProcessing(false)
      }
    },
    [signInForm, completeSignIn],
  )

  return {
    signInForm,
    error,
    processing,
    handleChange,
    handleSubmit,
  }
}
