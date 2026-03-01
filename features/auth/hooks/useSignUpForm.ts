'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { signIn } from '@/features/auth/action/signIn'
import { signUp } from '@/features/auth/action/signUp'
import useAuth from '@/features/auth/hooks/useAuth'
import { validateSignUpForm } from '@/features/auth/validation/signUp'
import {
  ROLE_INSTRUCTOR,
  ROLE_STUDENT,
  SIGN_IN_ERROR_MESSAGE,
  SIGN_IN_PATH,
  SIGN_UP_ERROR_MESSAGE,
} from '@/shared/libs/constants/constants'
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
  role: ROLE_STUDENT,
}

// 회원가입 도메인 로직 훅

export function useSignUpForm() {
  const router = useRouter()
  const { completeSignIn } = useAuth()
  const [signUpForm, setSignUpForm] = useState<ApiRequest<'/api/users/signup', 'post'>>(initialSignUpForm)
  const [error, setError] = useState<InvalidResult | null>(null)
  const [processing, setProcessing] = useState(false)
  // 입력 핸들러
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const nextValue = name === 'phone' ? formatPhoneNumber(value) : value
    setSignUpForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }))
  }, [])

  // 역할 변경 핸들러
  const handleRoleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      role: e.target.name as typeof ROLE_STUDENT | typeof ROLE_INSTRUCTOR,
    }))
  }, [])

  // 제출 핸들러
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
        await apiResponseHandler(() => signUp(signUpForm), { key: toastId })

        // 로그인 처리 (회원가입 후 자동 로그인)
        try {
          const signInResult = await apiResponseHandler(() => signIn({ email: signUpForm.email, password: signUpForm.password }))
          const user = signInResult?.user
          if (!user?.role || !user?.name) {
            errorHandler(new Error(SIGN_IN_ERROR_MESSAGE), {
              key: toastId,
              message: SIGN_IN_ERROR_MESSAGE,
              callback: () => {
                router.push(SIGN_IN_PATH)
              },
            })
            return
          }
          completeSignIn(user.role, user.name)
        } catch (signInErr) {
          errorHandler(signInErr instanceof Error ? signInErr : new Error(String(signInErr)), {
            key: toastId,
            message: SIGN_IN_ERROR_MESSAGE,
            callback: () => {
              router.push(SIGN_IN_PATH)
            },
          })
          return
        }
      } catch (err) {
        errorHandler(err instanceof Error ? err : new Error(String(err)), {
          key: toastId,
          message: SIGN_UP_ERROR_MESSAGE,
        })
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
