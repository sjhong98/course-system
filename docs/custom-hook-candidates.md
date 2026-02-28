# Custom Hook으로 뺄 만한 도메인 로직 정리

도메인별·기능별로 custom hook으로 분리할 만한 로직을 정리했습니다.

---

## 1. Auth 도메인

### 1-1. `useSignInForm` (권장)

**위치:** `SignInForm.tsx`

**훅으로 뺄 내용**

- 폼 상태: `signInForm`, `error`, `processing`
- `handleChange` (함수형 setState로 이미 메모이제이션 가능)
- `handleSubmit`: validation → signIn API → `completeSignIn` 호출

**이점**

- 컴포넌트는 UI만 담당하고, 로그인 도메인 로직은 훅으로 테스트·재사용 가능
- `completeSignIn`은 `useAuth()`에서 인자로 받음

**예상 시그니처**

```ts
// features/auth/hooks/useSignInForm.ts
function useSignInForm(completeSignIn: (role: string, name: string) => void) {
  const [signInForm, setSignInForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<InvalidResult | null>(null)
  const [processing, setProcessing] = useState(false)
  const handleChange = useCallback(...)
  const handleSubmit = useCallback(...)
  return { signInForm, error, processing, handleChange, handleSubmit }
}
```

---

### 1-2. `useSignUpForm` (권장)

**위치:** `SignUpForm.tsx`

**훅으로 뺄 내용**

- 폼 상태: `signUpForm`, `error`, `processing`
- `handleChange` (phone일 때 `formatPhoneNumber` 적용)
- `handleRoleChange`
- `handleSubmit`: validation → signUp → signIn → `completeSignIn`

**이점**

- 회원가입 플로우(가입 → 자동 로그인)를 한 곳에서 관리
- `completeSignIn`은 `useAuth()`에서 주입

**예상 시그니처**

```ts
// features/auth/hooks/useSignUpForm.ts
function useSignUpForm(completeSignIn: (role: string, name: string) => void) {
  const [signUpForm, setSignUpForm] = useState<ApiRequest<'/api/users/signup', 'post'>>(...)
  const [error, setError] = useState<InvalidResult | null>(null)
  const [processing, setProcessing] = useState(false)
  const handleChange = useCallback(...)
  const handleRoleChange = useCallback(...)
  const handleSubmit = useCallback(...)
  return { signUpForm, error, processing, handleChange, handleRoleChange, handleSubmit }
}
```

---

## 2. Course 도메인

### 2-1. `useCourseCreateForm` (권장)

**위치:** `CourseCreateForm.tsx`

**훅으로 뺄 내용**

- 폼 상태: `courseCreateForm`, `error`, `processing`
- **강사 전용 페이지 가드**: `useEffect`에서 role 체크 후 리다이렉트, name으로 `instructorName` 초기화
- `handleChange` (number 필드는 `parseNumber` 적용)
- `handleSubmit`: validation → createCourse → invalidate → push `/course/list`

**이점**

- “강의 개설” 도메인 로직(가드 + 폼 + 제출)을 한 훅으로 묶음
- `router`, `queryClient`는 훅 내부에서 `useRouter()`, `useQueryClient()`로 사용

**예상 시그니처**

```ts
// features/course/hooks/useCourseCreateForm.ts
function useCourseCreateForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [courseCreateForm, setCourseCreateForm] = useState<CourseCreateForm>(...)
  const [error, setError] = useState<InvalidResult | null>(null)
  const [processing, setProcessing] = useState(false)
  useEffect(/* 강사 체크 + instructorName 초기화 */)
  const handleChange = useCallback(...)
  const handleSubmit = useCallback(...)
  return { courseCreateForm, error, processing, handleChange, handleSubmit }
}
```

---

### 2-2. `useCourseDetail` (권장)

**위치:** `CourseDetail.tsx`

**훅으로 뺄 내용**

- 서버 결과 파싱: `result` → `apiSyncResponseHandler` → `course` 상태, 실패 시 `error` 상태
- `processing`, `handleEnroll` (enroll API + cache invalidation + 낙관적 업데이트로 `currentStudents`/`isFull` 갱신)

**이점**

- 상세 조회 + 수강 신청 도메인 로직을 훅으로 분리
- 컴포넌트는 `course`/`error`/`processing`/`handleEnroll`만 사용해 UI에 집중

**예상 시그니처**

```ts
// features/course/hooks/useCourseDetail.ts
function useCourseDetail(result: Awaited<ReturnType<typeof getCourse>>) {
  const queryClient = useQueryClient()
  const [course, setCourse] = useState(...)
  const [error, setError] = useState<string>(null)
  const [processing, setProcessing] = useState(false)
  useEffect(/* result 파싱 */)
  const handleEnroll = useCallback(...)
  return { course, error, processing, handleEnroll }
}
```

---

### 2-3. `useCourseListEnroll` (선택)

**위치:** `CourseList.tsx`

**훅으로 뺄 내용**

- `enrollCourseList` 상태, `processing`
- `handleEnrollCourseChange` (선택 토글)
- `handleEnrollCourse` (일괄 수강 신청 + 캐시 업데이트 + toast)
- 리스트 정규화(중복 제거) 로직은 query 데이터와 밀접하므로 훅에 함께 두거나, 별도 `useNormalizedCourseList(courseListData)` 같은 훅으로 분리 가능

**이점**

- “목록에서 여러 강의 수강 신청” 로직만 훅으로 분리 가능
- 다만 `courseList`, `sort`, `setParam`, `queryClient` 등 의존이 많아서 훅 인터페이스가 다소 커질 수 있음

**예상 시그니처**

```ts
// features/course/hooks/useCourseListEnroll.ts
function useCourseListEnroll(courseList: Course[], sort: CourseListSort) {
  const queryClient = useQueryClient()
  const { setParam } = useQueryParams()
  const [enrollCourseList, setEnrollCourseList] = useState<number[]>([])
  const [processing, setProcessing] = useState(false)
  const handleEnrollCourseChange = useCallback(...)
  const handleEnrollCourse = useCallback(...)
  return { enrollCourseList, processing, handleEnrollCourseChange, handleEnrollCourse }
}
```

---

### 2-4. 역할/강사 체크 → `useAuth` 확장 (권장)

**위치:** `CourseCreateForm.tsx`, `CourseListToolbar.tsx`

**현재**

- `CourseCreateForm`: `localStorage.getItem('role')`, `'INSTRUCTOR'` 비교 후 리다이렉트, `name`으로 `instructorName` 세팅
- `CourseListToolbar`: `localStorage.getItem('role') === 'INSTRUCTOR'`로 강사 여부에 따라 “강의 개설” 버튼 노출

**제안**

- `useAuth`에 `getUserInfo()`가 있으므로, 여기에 **`isInstructor`** (또는 `role === 'INSTRUCTOR'`) 반환 추가
- 또는 `useRole()` / `useInstructor()` 같은 훅을 두고, 내부에서 `localStorage.getItem('role')`만 읽어서 반환

**이점**

- 역할 체크가 `useAuth` 한 곳으로 모여서, 나중에 인증 방식이 바뀌어도 수정 지점이 줄어듦

**예시**

```ts
// useAuth.ts 확장
return {
  // 기존
  completeSignIn,
  completeSignOut,
  isLoggedIn,
  getUserInfo,
  // 추가
  isInstructor: () => localStorage.getItem('role') === 'INSTRUCTOR',
}
```

그 다음 `CourseListToolbar`에서는 `const { isInstructor } = useAuth()` 후 `isInstructor()` 호출하도록 변경.  
`CourseCreateForm`의 강사 가드는 `useCourseCreateForm` 안에서 `getUserInfo()`/`isInstructor()`를 사용하도록 정리 가능.

---

## 3. 요약 표

| 대상 | 훅 이름 | 도메인 | 우선순위 |
|------|--------|--------|----------|
| SignInForm | `useSignInForm` | auth | 권장 |
| SignUpForm | `useSignUpForm` | auth | 권장 |
| CourseCreateForm | `useCourseCreateForm` | course | 권장 |
| CourseDetail | `useCourseDetail` | course | 권장 |
| CourseList (수강 신청 부분) | `useCourseListEnroll` | course | 선택 |
| 역할/강사 체크 | `useAuth` 확장 (`isInstructor`) | auth | 권장 |

---

## 4. 공통 폼 훅 (참고)

여러 폼에서 반복되는 패턴은 다음과 같습니다.

- `form`, `error`, `processing` 상태
- `handleChange` (함수형 setState)
- `handleSubmit` (validate → API → 성공 처리)

도메인마다 validator·API·성공 후 처리가 달라서, **도메인별 훅**(`useSignInForm`, `useSignUpForm`, `useCourseCreateForm`)으로 두는 편이 유지보수에 유리합니다.  
나중에 폼이 더 늘어나면, “옵션 객체 + 제네릭” 형태의 `useFormWithValidation<T>` 같은 공통 훅을 도입할 수 있습니다.
