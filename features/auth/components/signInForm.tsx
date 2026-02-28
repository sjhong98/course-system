'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { signIn } from '@/action/signIn'
import { validateSignInForm } from '@/features/auth/validation/signIn'
import Column from '@/shared/components/flexBox/Column'
import { BottomButton } from '@/shared/components/ui/BottomButton'
import LabelInput from '@/shared/components/ui/LabelInput'
import { InvalidResult } from '@/shared/validation/types'
import { apiResponseHandler } from '@/shared/libs/utils/apiResponseHandler'
import { errorHandler } from '@/shared/libs/utils/errorHandler'

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
      await apiResponseHandler(() => signIn(signInForm))
      router.push('/course/list')
    } catch (error) {
      errorHandler(error)
    } finally {
      setProcessing(false)
    }
  }

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
        <BottomButton.Button processing={processing} type="submit">
          로그인
        </BottomButton.Button>
      </BottomButton.Container>
    </form>
  )
}
