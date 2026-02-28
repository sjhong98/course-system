import type { ApiRequest } from '@/shared/libs/utils/typeGenerator'
import { invalid, valid, type ValidationResult } from '@/shared/validation/types'
import { rules } from '@/shared/validation/rules'

const SIGNUP_PATH = '/api/users/signup'
export type SignUpForm = ApiRequest<typeof SIGNUP_PATH, 'post'>

export function validateSignUpForm(form: SignUpForm): ValidationResult<SignUpForm> {
  const errors: Record<string, string> = {}

  const nameError = rules.required('이름', form.name)
  if (nameError) errors.name = nameError

  const emailError = rules.required('이메일', form.email) ?? rules.email('이메일', form.email)
  if (emailError) errors.email = emailError

  const phoneError = rules.required('휴대폰 번호', form.phone) ?? rules.phoneFormat('휴대폰 번호', form.phone)
  if (phoneError) errors.phone = phoneError

  const passwordError = rules.required('비밀번호', form.password) ?? rules.passwordFormat('비밀번호', form.password)
  if (passwordError) errors.password = passwordError

  const validRoles = ['STUDENT', 'INSTRUCTOR'] as const
  if (!form.role || !validRoles.includes(form.role)) {
    errors.role = '역할을 선택해 주세요.'
  }

  if (Object.keys(errors).length > 0) return invalid(errors)
  return valid(form)
}
