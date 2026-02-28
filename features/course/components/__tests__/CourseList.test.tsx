import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import CourseList from '../CourseList'

const mockFetchNextPage = vi.fn()

const mockCoursePage = (items: Array<{ id: number; title: string; description?: string; instructorName?: string; price?: number; currentStudents?: number; maxStudents?: number; isFull?: boolean }>) => ({
  content: items,
  last: true,
  pageable: { pageNumber: 0 },
})

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({
    get: (key: string) => (key === 'sort' ? 'recent' : key === 'select' ? null : null),
  }),
}))

const mockSetParam = vi.fn()
vi.mock('@/shared/hooks/useQueryParams', () => ({
  useQueryParams: () => ({ setParam: mockSetParam }),
}))

let mockUpperInView = false
let mockLowerInView = false
let useInViewCallCount = 0
vi.mock('react-intersection-observer', () => ({
  useInView: () => {
    useInViewCallCount += 1
    if (useInViewCallCount === 1) return { ref: vi.fn(), inView: mockUpperInView }
    return { ref: vi.fn(), inView: mockLowerInView }
  },
}))

vi.mock('@/action/enrollCourseBatch', () => ({
  enrollCourseBatch: vi.fn(),
}))

const mockUseSuspenseInfiniteQuery = vi.fn()
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useSuspenseInfiniteQuery: (options: unknown) => mockUseSuspenseInfiniteQuery(options),
    useQueryClient: () => new QueryClient(),
  }
})

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('도메인1: 강의 리스트 (/course/list)', () => {
  const defaultCourseData = {
    pages: [mockCoursePage([
      { id: 1, title: '강의 A', description: '설명 A', instructorName: '강사1', price: 10000, currentStudents: 5, maxStudents: 30, isFull: false },
      { id: 2, title: '강의 B', description: '설명 B', instructorName: '강사2', price: 20000, currentStudents: 10, maxStudents: 10, isFull: true },
    ])],
    pageParams: [0],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    useInViewCallCount = 0
    mockUpperInView = false
    mockLowerInView = false
    mockUseSuspenseInfiniteQuery.mockReturnValue({
      data: defaultCourseData,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetching: false,
      isFetchingNextPage: false,
      error: null,
      failureCount: 0,
    })
  })

  afterEach(() => {
    cleanup()
  })

  describe('렌더링', () => {
    it('강의 목록이 정상 데이터로 렌더되면 강의 제목과 설명이 보인다', () => {
      render(<CourseList />, { wrapper: createWrapper() })

      expect(screen.getByText('강의 A')).toBeInTheDocument()
      expect(screen.getByText('강의 B')).toBeInTheDocument()
      expect(screen.getByLabelText('강의 목록')).toBeInTheDocument()
    })

    it('마지막 페이지이고 다음 페이지가 없으면 "모든 강의를 불러왔습니다" 문구가 보인다', () => {
      mockUseSuspenseInfiniteQuery.mockReturnValue({
        data: defaultCourseData,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: false,
        isFetching: false,
        isFetchingNextPage: false,
        error: null,
        failureCount: 0,
      })

      render(<CourseList />, { wrapper: createWrapper() })

      expect(screen.getByText('모든 강의를 불러왔습니다.')).toBeInTheDocument()
    })
  })

  describe('데이터 에러', () => {
    it('요청이 재시도 중이면(에러 후 재시도) 에러 메시지를 보여준다', () => {
      mockUseSuspenseInfiniteQuery.mockReturnValue({
        data: undefined,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: false,
        isFetching: true,
        isFetchingNextPage: false,
        error: new Error('네트워크 오류'),
        failureCount: 1,
      })

      render(<CourseList />, { wrapper: createWrapper() })

      expect(screen.getByText('네트워크 오류')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument()
    })

    it('에러 발생 시 Error 컴포넌트에 에러 메시지가 전달된다', () => {
      const errorMessage = '강의 목록을 불러올 수 없습니다.'
      mockUseSuspenseInfiniteQuery.mockReturnValue({
        data: undefined,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: false,
        isFetching: true,
        isFetchingNextPage: false,
        error: new Error(errorMessage),
        failureCount: 2,
      })

      render(<CourseList />, { wrapper: createWrapper() })

      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  describe('infinite scroll', () => {
    it('다음 페이지가 있고 하단이 뷰포트에 들어오면 fetchNextPage가 호출된다', async () => {
      mockLowerInView = true
      mockUseSuspenseInfiniteQuery.mockReturnValue({
        data: defaultCourseData,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetching: false,
        isFetchingNextPage: false,
        error: null,
        failureCount: 0,
      })

      render(<CourseList />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(mockFetchNextPage).toHaveBeenCalled()
      })
    })

    it('다음 페이지가 없으면 하단이 뷰포트에 있어도 fetchNextPage가 호출되지 않는다', async () => {
      mockLowerInView = true
      mockUseSuspenseInfiniteQuery.mockReturnValue({
        data: defaultCourseData,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: false,
        isFetching: false,
        isFetchingNextPage: false,
        error: null,
        failureCount: 0,
      })

      render(<CourseList />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(mockFetchNextPage).not.toHaveBeenCalled()
      })
    })
  })
})
