export const rules = {
  required: (field: string, value: unknown): string | null =>
    value === undefined || value === null || String(value).trim() === '' ? `${field}을(를) 입력해주세요.` : null,

  email: (_field: string, value: unknown): string | null => {
    if (value === undefined || value === null) return null // required는 별도
    const s = String(value).trim()
    if (s === '') return null
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(s) ? null : '올바른 이메일 형식이 아닙니다.'
  },

  /** 비밀번호 6~10자, 영문 소문자·대문자·숫자 중 최소 두 가지 이상 조합 */
  passwordFormat: (_field: string, value: unknown): string | null => {
    if (value === undefined || value === null) return null
    const s = String(value)
    if (s.length < 6 || s.length > 10) return '비밀번호는 6~10자여야 합니다.'
    const hasLower = /[a-z]/.test(s)
    const hasUpper = /[A-Z]/.test(s)
    const hasNumber = /\d/.test(s)
    const combinationCount = [hasLower, hasUpper, hasNumber].filter(Boolean).length
    return combinationCount >= 2
      ? null
      : '비밀번호는 영문 소문자, 대문자, 숫자 중 최소 두 가지 이상을 조합해야 합니다.'
  },

  minLength:
    (min: number) =>
    (field: string, value: unknown): string | null => {
      if (value === undefined || value === null) return null
      const len = String(value).trim().length
      return len >= min ? null : `${field}은(는) ${min}자 이상 입력해주세요.`
    },

  maxLength:
    (max: number) =>
    (field: string, value: unknown): string | null => {
      if (value === undefined || value === null) return null
      const len = String(value).trim().length
      return len <= max ? null : `${field}은(는) ${max}자 이하여야 합니다.`
    },

  /** 휴대폰 번호 3-4-4 형식 (숫자 11자리, 예: 010-1234-5678) */
  phoneFormat: (_field: string, value: unknown): string | null => {
    if (value === undefined || value === null) return null
    const digits = String(value).replace(/\D/g, '')
    if (digits.length !== 11) return '휴대폰 번호 형식을 확인해주세요. (ex. 010-1234-5678)'
    const validPrefix = /^01[0-9]/.test(digits)
    return validPrefix ? null : '휴대폰 번호 형식을 확인해주세요. (ex. 010-1234-5678)'
  },

  /** 숫자 최소값 (이상) */
  minNumber:
    (min: number) =>
    (field: string, value: unknown): string | null => {
      if (value === undefined || value === null) return null
      const n = Number(value)
      if (Number.isNaN(n)) return `${field}은(는) 숫자를 입력해주세요.`
      return n >= min ? null : `${field}은(는) ${min} 이상이어야 합니다.`
    },
} as const
