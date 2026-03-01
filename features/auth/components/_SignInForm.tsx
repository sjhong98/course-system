'use client'

import { useSignInForm } from '@/features/auth/hooks/useSignInForm'
import Column from '@/shared/components/flexBox/Column'
import Row from '@/shared/components/flexBox/Row'
import { BottomButton } from '@/shared/components/ui/BottomButton'
import LabelInput from '@/shared/components/ui/LabelInput'
import { SIGN_UP_PATH } from '@/shared/libs/constants/constants'
import Link from 'next/link'

// 로그인 폼 컴포넌트

export default function SignInForm() {
  const { signInForm, error, processing, handleChange, handleSubmit } = useSignInForm()

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
        <Column gap={20}>
          <BottomButton.Button processing={processing} type="submit" aria-label="로그인">
            로그인
          </BottomButton.Button>
          <Row className="justify-center">
            <Link href={SIGN_UP_PATH}>회원가입</Link>
          </Row>
        </Column>
      </BottomButton.Container>
    </form>
  )
}
