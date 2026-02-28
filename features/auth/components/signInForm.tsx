'use client'

import { useCallback, useState } from 'react'
import { signIn } from '@/action/signIn'
import { validateSignInForm } from '@/features/auth/validation/signIn'
import Column from '@/shared/components/flexBox/Column'
import { BottomButton } from '@/shared/components/ui/BottomButton'
import LabelInput from '@/shared/components/ui/LabelInput'
import useAuth from '@/shared/hooks/useAuth'
import { apiResponseHandler } from '@/shared/libs/utils/apiResponseHandler'
import { errorHandler } from '@/shared/libs/utils/errorHandler'
import { InvalidResult } from '@/shared/validation/types'

export default function SignInForm() {
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
        completeSignIn(signInResult.user.role, signInResult.user.name)
      } catch (error) {
        errorHandler(error, { key: toastId, message: '로그인 처리 중 오류가 발생했습니다.' })
      } finally {
        setProcessing(false)
      }
    },
    [signInForm, completeSignIn],
  )

  return (
    <form onSubmit={handleSubmit}>
      <Column gap={20}>
        <LabelInput label="이메일" name="email" value={signInForm.email} onChange={handleChange} placeholder="이메일" error={error} />
        <LabelInput
          label="비밀번호"
          name="password"
          type="password"
          value={signInForm.password}
          onChange={handleChange}
          placeholder="비밀번호"
          error={error}
        />
      </Column>
      <BottomButton.Container>
        <BottomButton.Button processing={processing} type="submit" aria-label="로그인">
          로그인
        </BottomButton.Button>
      </BottomButton.Container>
    </form>
  )
}
