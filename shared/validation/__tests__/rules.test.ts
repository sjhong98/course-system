import { describe, it, expect } from 'vitest'

import { rules } from '../rules'

describe('shared/validation/rules', () => {
  describe('required', () => {
    it('값이 비어 있으면 에러 메시지를 반환한다', () => {
      expect(rules.required('이름', '')).toBe('이름을(를) 입력해주세요.')
      expect(rules.required('이메일', null)).toBe('이메일을(를) 입력해주세요.')
      expect(rules.required('필드', undefined)).toBe('필드을(를) 입력해주세요.')
      expect(rules.required('필드', '   ')).toBe('필드을(를) 입력해주세요.')
    })

    it('값이 있으면 null을 반환한다', () => {
      expect(rules.required('이름', '홍길동')).toBeNull()
      expect(rules.required('숫자', 0)).toBeNull()
      expect(rules.required('숫자', 1)).toBeNull()
    })
  })

  describe('email', () => {
    it('빈 값이면 null을 반환한다 (required와 별도)', () => {
      expect(rules.email('이메일', '')).toBeNull()
      expect(rules.email('이메일', null)).toBeNull()
    })

    it('올바른 이메일 형식이면 null을 반환한다', () => {
      expect(rules.email('이메일', 'user@example.com')).toBeNull()
      expect(rules.email('이메일', 'a@b.co')).toBeNull()
    })

    it('잘못된 이메일 형식이면 에러 메시지를 반환한다', () => {
      expect(rules.email('이메일', 'invalid')).toBe('올바른 이메일 형식이 아닙니다.')
      expect(rules.email('이메일', 'no-at.com')).toBe('올바른 이메일 형식이 아닙니다.')
      expect(rules.email('이메일', '@nodomain.com')).toBe('올바른 이메일 형식이 아닙니다.')
    })
  })

  const passwordCombinationError =
    '비밀번호는 영문 소문자, 대문자, 숫자 중 최소 두 가지 이상을 조합해야 합니다.'

  describe('passwordFormat', () => {
    it('6~10자이고 소문자·대문자·숫자 중 두 가지 이상이면 null을 반환한다', () => {
      expect(rules.passwordFormat('비밀번호', 'pass1word')).toBeNull() // 소문자+숫자
      expect(rules.passwordFormat('비밀번호', 'abc123')).toBeNull() // 소문자+숫자
      expect(rules.passwordFormat('비밀번호', 'ABC123')).toBeNull() // 대문자+숫자
      expect(rules.passwordFormat('비밀번호', 'Abcdef')).toBeNull() // 소문자+대문자
    })

    it('길이가 6 미만이면 에러를 반환한다', () => {
      expect(rules.passwordFormat('비밀번호', 'ab1')).toBe('비밀번호는 6~10자여야 합니다.')
    })

    it('길이가 10 초과면 에러를 반환한다', () => {
      expect(rules.passwordFormat('비밀번호', 'abcdefghij1')).toBe('비밀번호는 6~10자여야 합니다.')
    })

    it('소문자만 있으면 에러를 반환한다', () => {
      expect(rules.passwordFormat('비밀번호', 'password')).toBe(passwordCombinationError)
    })

    it('대문자만 있으면 에러를 반환한다', () => {
      expect(rules.passwordFormat('비밀번호', 'PASSWORD')).toBe(passwordCombinationError)
    })

    it('숫자만 있으면 에러를 반환한다', () => {
      expect(rules.passwordFormat('비밀번호', '123456')).toBe(passwordCombinationError)
    })
  })

  describe('phoneFormat', () => {
    it('숫자 11자리(010으로 시작)면 null을 반환한다', () => {
      expect(rules.phoneFormat('휴대폰', '01012345678')).toBeNull()
      expect(rules.phoneFormat('휴대폰', '010-1234-5678')).toBeNull()
    })

    it('자릿수가 11이 아니면 에러를 반환한다', () => {
      expect(rules.phoneFormat('휴대폰', '010123456')).toBe('휴대폰 번호 형식을 확인해주세요. (ex. 010-1234-5678)')
      expect(rules.phoneFormat('휴대폰', '0101234567890')).toBe('휴대폰 번호 형식을 확인해주세요. (ex. 010-1234-5678)')
    })

    it('010이 아닌 접두사면 에러를 반환한다', () => {
      expect(rules.phoneFormat('휴대폰', '02012345678')).toBe('휴대폰 번호 형식을 확인해주세요. (ex. 010-1234-5678)')
    })
  })

  describe('minLength', () => {
    it('길이가 min 이상이면 null을 반환한다', () => {
      expect(rules.minLength(3)('제목', 'abc')).toBeNull()
      expect(rules.minLength(3)('제목', 'abcd')).toBeNull()
    })

    it('길이가 min 미만이면 에러를 반환한다', () => {
      expect(rules.minLength(3)('제목', 'ab')).toBe('제목은(는) 3자 이상 입력해주세요.')
    })
  })

  describe('maxLength', () => {
    it('길이가 max 이하이면 null을 반환한다', () => {
      expect(rules.maxLength(5)('이름', 'abc')).toBeNull()
      expect(rules.maxLength(5)('이름', 'abcde')).toBeNull()
    })

    it('길이가 max 초과면 에러를 반환한다', () => {
      expect(rules.maxLength(5)('이름', 'abcdef')).toBe('이름은(는) 5자 이하여야 합니다.')
    })
  })

  describe('minNumber', () => {
    it('값이 min 이상이면 null을 반환한다', () => {
      expect(rules.minNumber(0)('가격', 0)).toBeNull()
      expect(rules.minNumber(1)('수량', 1)).toBeNull()
    })

    it('값이 min 미만이면 에러를 반환한다', () => {
      expect(rules.minNumber(1)('수량', 0)).toBe('수량은(는) 1 이상이어야 합니다.')
      expect(rules.minNumber(0)('가격', -1)).toBe('가격은(는) 0 이상이어야 합니다.')
    })

    it('숫자가 아니면 에러를 반환한다', () => {
      expect(rules.minNumber(0)('가격', NaN)).toBe('가격은(는) 숫자를 입력해주세요.')
    })

    it('undefined/null이면 null을 반환한다', () => {
      expect(rules.minNumber(0)('가격', undefined)).toBeNull()
      expect(rules.minNumber(0)('가격', null)).toBeNull()
    })
  })
})
