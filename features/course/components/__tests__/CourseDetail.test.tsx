import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import CourseDetail from '@/features/course/components/CourseDetail'

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const mockInvalidateQueries = vi.fn()
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}))

const mockEnrollCourse = vi.fn()
vi.mock('@/action/enrollCourse', () => ({
  enrollCourse: (...args: unknown[]) => mockEnrollCourse(...args),
}))

const successResult = {
  data: {
    id: 1,
    title: '부동산 투자 기초',
    description: '부동산 투자의 기본 개념과 전략을 배웁니다.',
    instructorName: '김투자',
    maxStudents: 30,
    currentStudents: 5,
    availableSeats: 25,
    isFull: false,
    price: 100000,
    createdAt: '2024-01-15T14:30:00',
  },
}

const errorResult = {
  error: { message: '강의를 찾을 수 없습니다.' },
  status: 404,
}

describe('도메인2: 강의 상세 (/course/[courseId])', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  describe('정상 데이터 렌더링', () => {
    it('강의 상세 데이터가 정상이면 제목, 설명, 강사명, 가격이 보인다', async () => {
      render(<CourseDetail result={successResult} />)

      await waitFor(() => {
        expect(screen.getByText('부동산 투자 기초')).toBeInTheDocument()
      })
      expect(screen.getByText('부동산 투자의 기본 개념과 전략을 배웁니다.')).toBeInTheDocument()
      expect(screen.getByText(/강사 김투자/)).toBeInTheDocument()
      expect(screen.getByText('100,000원')).toBeInTheDocument()
      expect(screen.getByText('25개 남았습니다.')).toBeInTheDocument()
    })

    it('수강 신청 버튼이 보이고 정원 미달일 때 비활성화되지 않는다', async () => {
      render(<CourseDetail result={successResult} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '수강 신청' })).toBeInTheDocument()
      })
      expect(screen.getByRole('button', { name: '수강 신청' })).not.toBeDisabled()
    })

    it('정원 마감이면 "정원 마감" 문구가 보이고 수강 신청 버튼이 비활성화된다', async () => {
      const fullResult = {
        data: {
          ...successResult.data,
          currentStudents: 30,
          availableSeats: 0,
          isFull: true,
        },
      }
      render(<CourseDetail result={fullResult} />)

      await waitFor(() => {
        expect(screen.getByText('정원 마감')).toBeInTheDocument()
      })
      expect(screen.getByRole('button', { name: '수강 신청' })).toBeDisabled()
    })
  })

  describe('데이터 에러', () => {
    it('서버에서 에러 응답이 오면 에러 메시지를 보여준다', async () => {
      render(<CourseDetail result={errorResult} />)

      await waitFor(() => {
        expect(screen.getByText('강의를 찾을 수 없습니다.')).toBeInTheDocument()
      })
      expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument()
    })

    it('에러 시 Error 컴포넌트만 렌더하고 강의 정보는 보이지 않는다', async () => {
      render(<CourseDetail result={errorResult} />)

      await waitFor(() => {
        expect(screen.getByText('강의를 찾을 수 없습니다.')).toBeInTheDocument()
      })
      expect(screen.queryByText('부동산 투자 기초')).not.toBeInTheDocument()
    })
  })

  describe('수강 신청', () => {
    it('수강 신청 클릭 시 enrollCourse가 호출된다', async () => {
      const user = userEvent.setup()
      mockEnrollCourse.mockResolvedValue({ data: {} })

      render(<CourseDetail result={successResult} />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '수강 신청' })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: '수강 신청' }))

      await waitFor(() => {
        expect(mockEnrollCourse).toHaveBeenCalledWith(1)
      })
    })
  })
})
