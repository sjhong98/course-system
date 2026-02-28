import { describe, it, expect } from 'vitest'

import { validateCourseCreateForm } from '@/features/course/validation/createCourse'

describe('도메인3: 강의 등록 - 유효성 검사 (createCourse)', () => {
  const validForm = {
    title: '부동산 투자 기초',
    description: '기본 개념을 배웁니다.',
    instructorName: '김강사',
    maxStudents: 30,
    price: 100000,
  }

  describe('validateCourseCreateForm', () => {
    it('모든 필드가 유효하면 ok: true와 data를 반환한다', () => {
      const result = validateCourseCreateForm(validForm)
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data).toEqual(validForm)
      }
    })

    it('강의명이 비어 있으면 errors.title에 메시지를 반환한다', () => {
      const result = validateCourseCreateForm({ ...validForm, title: '' })
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.errors.title).toBe('강의명을(를) 입력해주세요.')
      }
    })

    it('강사명이 비어 있으면 errors.instructorName에 메시지를 반환한다', () => {
      const result = validateCourseCreateForm({ ...validForm, instructorName: '' })
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.errors.instructorName).toBe('강사명을(를) 입력해주세요.')
      }
    })

    it('수강 인원이 0이면 errors.maxStudents에 최소값 메시지를 반환한다', () => {
      const result = validateCourseCreateForm({ ...validForm, maxStudents: 0 })
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.errors.maxStudents).toBe('수강 인원은(는) 1 이상이어야 합니다.')
      }
    })

    it('가격이 음수면 errors.price에 최소값 메시지를 반환한다', () => {
      const result = validateCourseCreateForm({ ...validForm, price: -1000 })
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.errors.price).toBe('가격은(는) 0 이상이어야 합니다.')
      }
    })

    it('여러 필드가 잘못되면 모든 에러를 반환한다', () => {
      const result = validateCourseCreateForm({
        title: '',
        description: '',
        instructorName: '',
        maxStudents: 0,
        price: -1,
      })
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.errors.title).toBeDefined()
        expect(result.errors.instructorName).toBeDefined()
        expect(result.errors.maxStudents).toBeDefined()
        expect(result.errors.price).toBeDefined()
      }
    })
  })
})
