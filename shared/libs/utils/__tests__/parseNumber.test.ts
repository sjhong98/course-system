import { describe, it, expect, vi } from 'vitest'

import parseNumber from '../parseNumber'

function createChangeEvent(value: string): React.ChangeEvent<HTMLInputElement> {
  return {
    target: { value },
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as unknown as React.ChangeEvent<HTMLInputElement>
}

describe('shared/libs/utils/parseNumber', () => {
  it('숫자만 추출해 파싱한다', () => {
    expect(parseNumber(createChangeEvent('123'), 0)).toBe(123)
    expect(parseNumber(createChangeEvent('1,000원'), 0)).toBe(1000)
  })

  it('빈 문자열이면 0을 반환한다', () => {
    expect(parseNumber(createChangeEvent(''), 0)).toBe(0)
    expect(parseNumber(createChangeEvent(''), 100)).toBe(0)
  })

  it('12자리를 초과하면 originNumber를 그대로 반환한다', () => {
    expect(parseNumber(createChangeEvent('1234567890123'), 0)).toBe(0)
    expect(parseNumber(createChangeEvent('1234567890123'), 999)).toBe(999)
  })

  it('originNumber가 0이고 두 자리 입력 시 선행 0을 제거한 한 자리로 반환한다', () => {
    expect(parseNumber(createChangeEvent('05'), 0)).toBe(5)
    expect(parseNumber(createChangeEvent('09'), 0)).toBe(9)
  })

  it('일반적인 입력은 파싱된 숫자를 반환한다', () => {
    expect(parseNumber(createChangeEvent('30'), 1)).toBe(30)
    expect(parseNumber(createChangeEvent('100000'), 0)).toBe(100000)
  })
})
