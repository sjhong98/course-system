import { rules } from '@/shared/validation/rules'
import { invalid, valid, type ValidationResult } from '@/shared/validation/types'

export type SignInForm = { email: string; password: string }

// 로그인 폼 유효성 검사

export function validateSignInForm(form: SignInForm): ValidationResult<SignInForm> {
  const errors: Record<string, string> = {}

  const emailError = rules.required('이메일', form.email) ?? rules.email('이메일', form.email)
  if (emailError) errors.email = emailError

  const passwordError = rules.required('비밀번호', form.password)
  if (passwordError) errors.password = passwordError

  if (Object.keys(errors).length > 0) return invalid(errors)
  return valid(form)
}
