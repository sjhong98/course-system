'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { signIn } from '@/action/signIn'
import Column from '@/shared/components/flexBox/Column'
import { BottomButton } from '@/shared/components/ui/BottomButton'
import LabelInput from '@/shared/components/ui/LabelInput'
import { validateSignInForm } from '@/features/auth/validation/signIn'
import { InvalidResult } from '@/shared/validation/types'
import { apiErrorHandler } from '@/shared/libs/utils/apiErrorHandler'

export default function SignInForm() {
  const router = useRouter()
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<InvalidResult | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInForm({
      ...signInForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setProcessing(true)
      e.preventDefault()
      const result = validateSignInForm(signInForm)
      if (result.ok === false) {
        setError(result)
        return
      }
      await signIn(signInForm)
    } catch (error) {
      apiErrorHandler(error, '로그인 처리 중 오류가 발생했습니다.')
    } finally {
      setProcessing(false)
      router.push('/course/list')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Column gap={20}>
        <LabelInput label="이메일" name="email" value={signInForm.email} onChange={handleChange} placeholder="이메일" />
        <LabelInput
          label="비밀번호"
          name="password"
          type="password"
          value={signInForm.password}
          onChange={handleChange}
          placeholder="비밀번호"
        />
      </Column>
      <BottomButton.Container>
        <BottomButton.Button processing={processing}>로그인</BottomButton.Button>
      </BottomButton.Container>
    </form>
  )
}
