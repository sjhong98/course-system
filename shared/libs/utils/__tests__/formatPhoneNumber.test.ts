import { describe, it, expect } from 'vitest'

import formatPhoneNumber from '@/shared/libs/utils/formatPhoneNumber'

describe('shared/libs/utils/formatPhoneNumber', () => {
  it('숫자만 3자리면 그대로 반환한다', () => {
    expect(formatPhoneNumber('010')).toBe('010')
  })

  it('숫자 3–4자리면 3-나머지 형식으로 반환한다', () => {
    expect(formatPhoneNumber('0101')).toBe('010-1')
    expect(formatPhoneNumber('0101234')).toBe('010-1234')
  })

  it('숫자 11자리면 3-4-4 형식으로 반환한다', () => {
    expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678')
  })

  it('이미 하이픈이 있어도 숫자만 추출해 포맷한다', () => {
    expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678')
  })

  it('11자리를 초과하면 앞 11자리만 사용한다', () => {
    expect(formatPhoneNumber('01012345678999')).toBe('010-1234-5678')
  })

  it('숫자 타입을 문자열로 변환해 포맷한다 (앞자리 0은 숫자에서 사라짐)', () => {
    expect(formatPhoneNumber(1012345678)).toBe('101-2345-678')
  })
})
