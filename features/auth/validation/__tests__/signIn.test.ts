import { describe, it, expect } from 'vitest'

import { validateSignInForm } from '../signIn'

describe('features/auth/validation/signIn', () => {
  const validForm = { email: 'user@example.com', password: 'pass1word' }

  describe('validateSignInForm', () => {
    it('이메일과 비밀번호가 모두 유효하면 ok: true와 data를 반환한다', () => {
      const result = validateSignInForm(validForm)
      expect(result.ok).toBe(true)
      if (result.ok) expect(result.data).toEqual(validForm)
    })

    it('이메일이 비어 있으면 errors.email을 반환한다', () => {
      const result = validateSignInForm({ ...validForm, email: '' })
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.errors.email).toBe('이메일을(를) 입력해주세요.')
    })

    it('이메일 형식이 잘못되면 errors.email을 반환한다', () => {
      const result = validateSignInForm({ ...validForm, email: 'invalid' })
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.errors.email).toBe('올바른 이메일 형식이 아닙니다.')
    })

    it('비밀번호가 비어 있으면 errors.password를 반환한다', () => {
      const result = validateSignInForm({ ...validForm, password: '' })
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.errors.password).toBe('비밀번호을(를) 입력해주세요.')
    })

    it('여러 필드가 비어 있으면 모든 에러를 반환한다', () => {
      const result = validateSignInForm({ email: '', password: '' })
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.errors.email).toBeDefined()
        expect(result.errors.password).toBeDefined()
      }
    })
  })
})
