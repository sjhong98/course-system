import { describe, it, expect } from 'vitest'

import { validateSignUpForm } from '../signUp'

describe('features/auth/validation/signUp', () => {
  const validForm = {
    name: '홍길동',
    email: 'user@example.com',
    phone: '010-1234-5678',
    password: 'pass1word',
    role: 'STUDENT' as const,
  }

  describe('validateSignUpForm', () => {
    it('모든 필드가 유효하면 ok: true와 data를 반환한다', () => {
      const result = validateSignUpForm(validForm)
      expect(result.ok).toBe(true)
      if (result.ok) expect(result.data).toEqual(validForm)
    })

    it('이름이 비어 있으면 errors.name을 반환한다', () => {
      const result = validateSignUpForm({ ...validForm, name: '' })
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.errors.name).toBe('이름을(를) 입력해주세요.')
    })

    it('이메일이 비어 있으면 errors.email을 반환한다', () => {
      const result = validateSignUpForm({ ...validForm, email: '' })
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.errors.email).toBe('이메일을(를) 입력해주세요.')
    })

    it('이메일 형식이 잘못되면 errors.email을 반환한다', () => {
      const result = validateSignUpForm({ ...validForm, email: 'invalid' })
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.errors.email).toBe('올바른 이메일 형식이 아닙니다.')
    })

    it('휴대폰 번호 형식이 잘못되면 errors.phone을 반환한다', () => {
      const result = validateSignUpForm({ ...validForm, phone: '123' })
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.errors.phone).toContain('휴대폰 번호')
    })

    it('비밀번호가 비어 있으면 errors.password를 반환한다', () => {
      const result = validateSignUpForm({ ...validForm, password: '' })
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.errors.password).toBe('비밀번호을(를) 입력해주세요.')
    })

    it('비밀번호가 6~10자 영문+숫자가 아니면 errors.password를 반환한다', () => {
      const result = validateSignUpForm({ ...validForm, password: 'short' })
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.errors.password).toBe('비밀번호는 6~10자여야 합니다.')
    })

    it('비밀번호에 숫자가 없으면 에러를 반환한다', () => {
      const result = validateSignUpForm({ ...validForm, password: 'password' })
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.errors.password).toBe('비밀번호는 영문과 숫자를 포함해야 합니다.')
    })

    it('role은 STUDENT 또는 INSTRUCTOR 모두 유효하다', () => {
      expect(validateSignUpForm({ ...validForm, role: 'STUDENT' }).ok).toBe(true)
      expect(validateSignUpForm({ ...validForm, role: 'INSTRUCTOR' }).ok).toBe(true)
    })
  })
})
