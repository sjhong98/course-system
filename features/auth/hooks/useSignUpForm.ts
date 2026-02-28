'use client'

import { useCallback, useState } from 'react'

import { signIn } from '@/action/signIn'
import { signUp } from '@/action/signUp'
import { validateSignUpForm } from '@/features/auth/validation/signUp'
import useAuth from '@/shared/hooks/useAuth'
import { apiResponseHandler } from '@/shared/libs/utils/apiResponseHandler'
import { errorHandler } from '@/shared/libs/utils/errorHandler'
import formatPhoneNumber from '@/shared/libs/utils/formatPhoneNumber'
import { ApiRequest } from '@/shared/libs/utils/typeGenerator'
import type { InvalidResult } from '@/shared/validation/types'

const initialSignUpForm: ApiRequest<'/api/users/signup', 'post'> = {
  email: '',
  password: '',
  name: '',
  phone: '',
  role: 'STUDENT',
}

export function useSignUpForm() {
  const { completeSignIn } = useAuth()
  const [signUpForm, setSignUpForm] = useState<ApiRequest<'/api/users/signup', 'post'>>(initialSignUpForm)
  const [error, setError] = useState<InvalidResult | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const nextValue = name === 'phone' ? formatPhoneNumber(value) : value
    setSignUpForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }))
  }, [])

  const handleRoleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      role: e.target.name as 'STUDENT' | 'INSTRUCTOR',
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      const toastId = 'sign-up'
      try {
        e.preventDefault()
        setProcessing(true)

        const result = validateSignUpForm(signUpForm)
        if (result.ok === false) {
          setError(result)
          return
        } else {
          setError(null)
        }
        await apiResponseHandler(async () => await signUp(signUpForm), { key: toastId })
        const signInResult = await apiResponseHandler(async () => await signIn({ email: signUpForm.email, password: signUpForm.password }))
        completeSignIn(signInResult.user.role, signInResult.user.name)
      } catch (err) {
        errorHandler(err, { key: toastId, message: '회원가입 처리 중 오류가 발생했습니다.' })
      } finally {
        setProcessing(false)
      }
    },
    [signUpForm, completeSignIn],
  )

  return {
    signUpForm,
    error,
    processing,
    handleChange,
    handleRoleChange,
    handleSubmit,
  }
}
