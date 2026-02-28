'use client'

import Column from '@/shared/components/flexBox/Column'
import Row from '@/shared/components/flexBox/Row'
import { BottomButton } from '@/shared/components/ui/BottomButton'
import CheckBox from '@/shared/components/ui/CheckBox'
import LabelInput from '@/shared/components/ui/LabelInput'

import { useSignUpForm } from '@/features/auth/hooks/useSignUpForm'

// 회원가입 폼 컴포넌트

export default function SignUpForm() {
  const { signUpForm, error, processing, handleChange, handleRoleChange, handleSubmit } = useSignUpForm()

  return (
    <form onSubmit={handleSubmit}>
      <Column gap={20} className="h-full">
        <LabelInput label="이름" name="name" value={signUpForm.name} onChange={handleChange} error={error} required />
        <LabelInput label="이메일" name="email" value={signUpForm.email} onChange={handleChange} error={error} required />
        <LabelInput label="휴대폰 번호" name="phone" value={signUpForm.phone} onChange={handleChange} error={error} required />
        <LabelInput
          label="비밀번호"
          type="password"
          name="password"
          value={signUpForm.password}
          onChange={handleChange}
          error={error}
          required
        />
        <Row className="w-full" role="group" aria-label="역할 선택">
          <CheckBox
            label="수강생"
            className="flex-1"
            name="STUDENT"
            checked={signUpForm.role === 'STUDENT'}
            onChange={handleRoleChange}
            aria-label="수강생"
          />
          <CheckBox
            label="강사"
            className="flex-1"
            name="INSTRUCTOR"
            checked={signUpForm.role === 'INSTRUCTOR'}
            onChange={handleRoleChange}
            aria-label="강사"
          />
        </Row>
      </Column>
      <BottomButton.Container type="submit">
        <BottomButton.Button processing={processing} type="submit" aria-label="회원가입">
          회원가입
        </BottomButton.Button>
      </BottomButton.Container>
    </form>
  )
}
