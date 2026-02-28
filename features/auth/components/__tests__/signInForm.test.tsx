import { render, screen, waitFor, within, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import SignInForm from '@/features/auth/components/SignInForm'

function getForm(container: HTMLElement): HTMLElement {
  const form = container.querySelector('form')
  if (!form) throw new Error('form not found')
  return form as HTMLElement
}

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const mockCompleteSignIn = vi.fn()
vi.mock('@/features/auth/hooks/useAuth', () => ({
  default: () => ({
    completeSignIn: mockCompleteSignIn,
  }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

const mockSignIn = vi.fn()
vi.mock('@/action/signIn', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}))

describe('시나리오 1: 로그인 (/signin)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSignIn.mockResolvedValue({
      data: { user: { role: 'STUDENT', name: '테스트' } },
    })
  })
  afterEach(() => {
    cleanup()
  })

  describe('렌더링', () => {
    it('이메일, 비밀번호 입력 필드와 로그인 버튼이 보인다', () => {
      const { container } = render(<SignInForm />)
      const form = getForm(container)

      expect(within(form).getByLabelText('이메일')).toBeInTheDocument()
      expect(within(form).getByLabelText('비밀번호')).toBeInTheDocument()
      expect(within(form).getByRole('button', { name: '로그인' })).toBeInTheDocument()
    })
  })

  describe('유효성 검사', () => {
    it('이메일이 비어 있으면 제출 시 에러 메시지를 보여준다', async () => {
      const user = userEvent.setup()
      const { container } = render(<SignInForm />)
      const form = getForm(container)

      await user.type(within(form).getByLabelText('비밀번호'), 'password1!')
      await user.click(within(form).getByRole('button', { name: '로그인' }))

      await waitFor(() => {
        expect(screen.getByText(/이메일을\(를\) 입력해주세요/)).toBeInTheDocument()
      })
      expect(mockSignIn).not.toHaveBeenCalled()
    })

    it('비밀번호가 비어 있으면 제출 시 에러 메시지를 보여준다', async () => {
      const user = userEvent.setup()
      const { container } = render(<SignInForm />)
      const form = getForm(container)

      await user.type(within(form).getByLabelText('이메일'), 'test@example.com')
      await user.click(within(form).getByRole('button', { name: '로그인' }))

      await waitFor(() => {
        expect(screen.getByText(/비밀번호을\(를\) 입력해주세요/)).toBeInTheDocument()
      })
      expect(mockSignIn).not.toHaveBeenCalled()
    })

    it('이메일 형식이 올바르지 않으면 제출 시 에러 메시지를 보여준다', async () => {
      const user = userEvent.setup()
      const { container } = render(<SignInForm />)
      const form = getForm(container)

      await user.type(within(form).getByLabelText('이메일'), 'invalid-email')
      await user.type(within(form).getByLabelText('비밀번호'), 'password1!')
      await user.click(within(form).getByRole('button', { name: '로그인' }))

      await waitFor(() => {
        expect(screen.getByText(/올바른 이메일 형식이 아닙니다/)).toBeInTheDocument()
      })
      expect(mockSignIn).not.toHaveBeenCalled()
    })

    it('모든 필드가 비어 있으면 제출 시 에러 메시지를 보여준다', async () => {
      const user = userEvent.setup()
      const { container } = render(<SignInForm />)
      const form = getForm(container)

      await user.click(within(form).getByRole('button', { name: '로그인' }))

      await waitFor(() => {
        const errors = screen.getAllByText(/입력해주세요/)
        expect(errors.length).toBeGreaterThanOrEqual(1)
      })
      expect(mockSignIn).not.toHaveBeenCalled()
    })
  })

  describe('로그인 성공', () => {
    it('유효한 이메일과 비밀번호 입력 후 제출하면 signIn이 호출되고 completeSignIn이 호출된다', async () => {
      const user = userEvent.setup()
      const { container } = render(<SignInForm />)
      const form = getForm(container)

      await user.type(within(form).getByLabelText('이메일'), 'user@example.com')
      await user.type(within(form).getByLabelText('비밀번호'), 'password1!')
      await user.click(within(form).getByRole('button', { name: '로그인' }))

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'user@example.com',
          password: 'password1!',
        })
      })
      await waitFor(() => {
        expect(mockCompleteSignIn).toHaveBeenCalledWith('STUDENT', '테스트')
      })
    })
  })
})
