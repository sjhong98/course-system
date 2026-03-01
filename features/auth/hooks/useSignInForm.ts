'use client'

import { useCallback, useState } from 'react'

import { signIn } from '@/features/auth/action/signIn'
import useAuth from '@/features/auth/hooks/useAuth'
import { validateSignInForm } from '@/features/auth/validation/signIn'
import { SIGN_IN_ERROR_MESSAGE } from '@/shared/libs/constants/constants'
import { apiResponseHandler } from '@/shared/libs/utils/apiResponseHandler'
import { errorHandler } from '@/shared/libs/utils/errorHandler'
import type { InvalidResult } from '@/shared/validation/types'

// 로그인 도메인 로직 훅

export function useSignInForm() {
  const { completeSignIn } = useAuth()
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<InvalidResult | null>(null)
  const [processing, setProcessing] = useState(false)

  // 입력 핸들러
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }, [])

  // 제출 핸들러
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
          errorHandler(new Error(SIGN_IN_ERROR_MESSAGE), {
            key: toastId,
            message: SIGN_IN_ERROR_MESSAGE,
          })
          return
        }
        completeSignIn(user.role, user.name)
      } catch (err) {
        errorHandler(err, { key: toastId, message: SIGN_IN_ERROR_MESSAGE })
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
