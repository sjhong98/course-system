import { render, screen, waitFor, within, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import SignUpForm from '@/features/auth/components/SignUpForm'

function getForm(container: HTMLElement): HTMLElement {
  const form = container.querySelector('form')
  if (!form) throw new Error('form not found')
  return form as HTMLElement
}

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const mockCompleteSignIn = vi.fn()
vi.mock('@/shared/hooks/useAuth', () => ({
  default: () => ({
    completeSignIn: mockCompleteSignIn,
  }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

const mockSignUp = vi.fn()
const mockSignIn = vi.fn()
vi.mock('@/action/signUp', () => ({
  signUp: (...args: unknown[]) => mockSignUp(...args),
}))
vi.mock('@/action/signIn', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}))

describe('시나리오 2: 회원가입 (/signup)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSignUp.mockResolvedValue({ data: {} })
    mockSignIn.mockResolvedValue({
      data: { user: { role: 'STUDENT', name: '홍길동' } },
    })
  })
  afterEach(() => {
    cleanup()
  })

  describe('렌더링', () => {
    it('이름, 이메일, 휴대폰 번호, 비밀번호 입력 필드가 보인다', () => {
      const { container } = render(<SignUpForm />)
      const scope = within(container)

      expect(scope.getByLabelText(/^이름/)).toBeInTheDocument()
      expect(scope.getByLabelText(/^이메일/)).toBeInTheDocument()
      expect(scope.getByLabelText(/^휴대폰 번호/)).toBeInTheDocument()
      expect(scope.getByLabelText(/^비밀번호/)).toBeInTheDocument()
    })

    it('수강생/강사 역할 선택과 회원가입 버튼이 보인다', () => {
      const { container } = render(<SignUpForm />)
      const form = getForm(container)

      expect(within(form).getByRole('group', { name: '역할 선택' })).toBeInTheDocument()
      expect(within(form).getByRole('checkbox', { name: '수강생' })).toBeInTheDocument()
      expect(within(form).getByRole('checkbox', { name: '강사' })).toBeInTheDocument()
      expect(within(form).getByRole('button', { name: '회원가입' })).toBeInTheDocument()
    })
  })

  describe('유효성 검사', () => {
    it('필수 필드가 비어 있으면 제출 시 에러 메시지를 보여준다', async () => {
      const user = userEvent.setup()
      const { container } = render(<SignUpForm />)
      const form = getForm(container)

      await user.click(within(form).getByRole('button', { name: '회원가입' }))

      await waitFor(() => {
        const errors = screen.getAllByText(/을\(를\) 입력해주세요/)
        expect(errors.length).toBeGreaterThanOrEqual(1)
      })
      expect(mockSignUp).not.toHaveBeenCalled()
    })

    it('이메일 형식이 올바르지 않으면 에러 메시지를 보여준다', async () => {
      const user = userEvent.setup()
      const { container } = render(<SignUpForm />)
      const form = getForm(container)

      await user.type(within(form).getByLabelText(/^이름/), '홍길동')
      await user.type(within(form).getByLabelText(/^이메일/), 'invalid')
      await user.type(within(form).getByLabelText(/^휴대폰 번호/), '010-1234-5678')
      await user.type(within(form).getByLabelText(/^비밀번호/), 'pass1word')
      await user.click(within(form).getByRole('button', { name: '회원가입' }))

      await waitFor(() => {
        expect(screen.getByText(/올바른 이메일 형식이 아닙니다/)).toBeInTheDocument()
      })
      expect(mockSignUp).not.toHaveBeenCalled()
    })

    it('비밀번호가 형식에 맞지 않으면 에러 메시지를 보여준다', async () => {
      const user = userEvent.setup()
      const { container } = render(<SignUpForm />)
      const form = getForm(container)

      await user.type(within(form).getByLabelText(/^이름/), '홍길동')
      await user.type(within(form).getByLabelText(/^이메일/), 'user@example.com')
      await user.type(within(form).getByLabelText(/^휴대폰 번호/), '010-1234-5678')
      await user.type(within(form).getByLabelText(/^비밀번호/), 'short')
      await user.click(within(form).getByRole('button', { name: '회원가입' }))

      await waitFor(() => {
        expect(screen.getByText(/비밀번호는 6~10자여야 합니다/)).toBeInTheDocument()
      })
      expect(mockSignUp).not.toHaveBeenCalled()
    })

    it('휴대폰 번호 형식이 올바르지 않으면 에러 메시지를 보여준다', async () => {
      const user = userEvent.setup()
      const { container } = render(<SignUpForm />)
      const form = getForm(container)

      await user.type(within(form).getByLabelText(/^이름/), '홍길동')
      await user.type(within(form).getByLabelText(/^이메일/), 'user@example.com')
      await user.type(within(form).getByLabelText(/^휴대폰 번호/), '123')
      await user.type(within(form).getByLabelText(/^비밀번호/), 'pass1word')
      await user.click(within(form).getByRole('button', { name: '회원가입' }))

      await waitFor(() => {
        expect(screen.getByText(/휴대폰 번호 형식을 확인해주세요/)).toBeInTheDocument()
      })
      expect(mockSignUp).not.toHaveBeenCalled()
    })
  })

  describe('역할 선택', () => {
    it('기본값은 수강생이 선택되어 있다', () => {
      const { container } = render(<SignUpForm />)
      const form = getForm(container)

      expect(within(form).getByRole('checkbox', { name: '수강생' })).toBeChecked()
      expect(within(form).getByRole('checkbox', { name: '강사' })).not.toBeChecked()
    })

    it('강사를 클릭하면 강사가 선택된다', async () => {
      const user = userEvent.setup()
      const { container } = render(<SignUpForm />)
      const form = getForm(container)

      await user.click(within(form).getByRole('checkbox', { name: '강사' }))

      expect(within(form).getByRole('checkbox', { name: '강사' })).toBeChecked()
      expect(within(form).getByRole('checkbox', { name: '수강생' })).not.toBeChecked()
    })

    it('수강생을 클릭하면 수강생이 선택된다', async () => {
      const user = userEvent.setup()
      const { container } = render(<SignUpForm />)
      const form = getForm(container)

      await user.click(within(form).getByRole('checkbox', { name: '강사' }))
      await user.click(within(form).getByRole('checkbox', { name: '수강생' }))

      expect(within(form).getByRole('checkbox', { name: '수강생' })).toBeChecked()
      expect(within(form).getByRole('checkbox', { name: '강사' })).not.toBeChecked()
    })
  })

  describe('회원가입 성공', () => {
    it('유효한 정보 입력 후 제출하면 signUp과 signIn이 호출되고 completeSignIn이 호출된다', async () => {
      const user = userEvent.setup()
      const { container } = render(<SignUpForm />)
      const form = getForm(container)

      await user.type(within(form).getByLabelText(/^이름/), '홍길동')
      await user.type(within(form).getByLabelText(/^이메일/), 'hong@example.com')
      await user.type(within(form).getByLabelText(/^휴대폰 번호/), '010-1234-5678')
      await user.type(within(form).getByLabelText(/^비밀번호/), 'pass1word')
      await user.click(within(form).getByRole('button', { name: '회원가입' }))

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith(
          expect.objectContaining({
            name: '홍길동',
            email: 'hong@example.com',
            phone: '010-1234-5678',
            password: 'pass1word',
            role: 'STUDENT',
          }),
        )
      })
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'hong@example.com',
          password: 'pass1word',
        })
      })
      await waitFor(() => {
        expect(mockCompleteSignIn).toHaveBeenCalledWith('STUDENT', '홍길동')
      })
    })

    it('강사로 선택 후 제출하면 role이 INSTRUCTOR로 전달된다', async () => {
      const user = userEvent.setup()
      mockSignIn.mockResolvedValue({
        data: { user: { role: 'INSTRUCTOR', name: '김강사' } },
      })

      const { container } = render(<SignUpForm />)
      const form = getForm(container)

      await user.type(within(form).getByLabelText(/^이름/), '김강사')
      await user.type(within(form).getByLabelText(/^이메일/), 'instructor@example.com')
      await user.type(within(form).getByLabelText(/^휴대폰 번호/), '010-9876-5432')
      await user.type(within(form).getByLabelText(/^비밀번호/), 'pass1word')
      await user.click(within(form).getByRole('checkbox', { name: '강사' }))
      await user.click(within(form).getByRole('button', { name: '회원가입' }))

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith(
          expect.objectContaining({
            role: 'INSTRUCTOR',
          }),
        )
      })
      await waitFor(() => {
        expect(mockCompleteSignIn).toHaveBeenCalledWith('INSTRUCTOR', '김강사')
      })
    })
  })
})
