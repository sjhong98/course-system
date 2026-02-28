# lecture-system

### Prerequisites

아래 환경에서 개발되었습니다.

- Node.js v20.x
- npm 10.x

### 1. Repository Clone

```bash
git clone <repository-url>
cd lecture-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

브라우저에서 아래 주소 또는 실행된 포트로 접속합니다.

```
http://localhost:3000
```

<br />

### 프로젝트 개요

로그인, 회원가입, 강의 목록·상세·생성, 수강 신청 기능이 구현된 강의 관리 서비스

<br />

### 기술 스택

- Framework/Language: Next.js 16, React 19, TypeScript
- State/Data Fetching: TanStack React Query, openapi-fetch
- UI: Tailwind CSS 4, react-toastify, lucide-react
- 기타: dayjs, react-intersection-observer

<br />

### 폴더 구조

```
app/
├── layout.tsx              # 루트 레이아웃
├── page.tsx                # 메인(/) - 로그인으로 리다이렉트
├── Providers.tsx           # React Query 등 Provider
├── globals.css
├── error.tsx               # 전역 에러 바운더리
├── loading.tsx             # 전역 로딩
│
├── signin/
│   ├── layout.tsx
│   └── page.tsx            # /signin - 로그인
├── signup/
│   ├── layout.tsx
│   └── page.tsx            # /signup - 회원가입
│
├── course/
│   ├── list/
│   │   ├── layout.tsx
│   │   ├── page.tsx        # /course/list - 강의 목록
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── create/
│   │   ├── layout.tsx
│   │   └── page.tsx        # /course/create - 강의 생성
│   └── [courseId]/
│       ├── layout.tsx
│       └── page.tsx        # /course/[courseId] - 강의 상세
│
action/                      # Server Actions
├── signIn.ts
├── signUp.ts
├── getCourseList.ts
├── getCourse.ts
├── createCourse.ts
├── enrollCourse.ts
└── enrollCourseBatch.ts
│
features/
├── auth/                    # 인증 기능
│   ├── components/
│   │   ├── signInForm.tsx
│   │   └── SignUpForm.tsx
│   ├── hooks/
│   │   ├── useSignInForm.ts
│   │   └── useSignUpForm.ts
│   └── validation/
│       ├── signIn.ts
│       └── signUp.ts
└── course/                  # 강의 기능
    ├── components/
    │   ├── CourseList.tsx
    │   ├── CourseListContainer.tsx
    │   ├── CourseListToolbar.tsx
    │   ├── CourseListSkeleton.tsx
    │   ├── CourseDetail.tsx
    │   ├── CourseDetailContainer.tsx
    │   ├── CourseDetailSkeleton.tsx
    │   └── CourseCreateForm.tsx
    ├── hooks/
    │   ├── useCourseList.ts
    │   ├── useCourseDetail.ts
    │   └── useCourseCreateForm.ts
    ├── query/
    │   └── courseQuery.ts
    └── validation/
        └── createCourse.ts
│
shared/
├── components/
│   ├── ui/                  # 공용 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   ├── LabelInput.tsx
│   │   ├── BottomButton.tsx
│   │   ├── Error.tsx
│   │   ├── Menu.tsx
│   │   └── ...
│   ├── container/
│   │   ├── MobileWrapper.tsx
│   │   └── PaddingHorizontalOverrideContainer.tsx
│   └── flexBox/
│       ├── Row.tsx
│       └── Column.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useQueryParams.ts
├── libs/
│   ├── api/
│   │   ├── api.ts
│   │   └── scheme.d.ts
│   ├── constants/
│   │   └── constants.ts
│   └── utils/
│       ├── apiResponseHandler.ts
│       ├── errorHandler.ts
│       ├── formatNumber.ts
│       ├── formatPhoneNumber.ts
│       ├── parseNumber.ts
│       └── cn.ts
└── validation/
    ├── rules.ts
    └── types.ts
```

<br />

### 페이지 구성

1. **/**
   - 메인 페이지 (로그인 페이지로 리다이렉트)

2. **/signin**
   - 로그인 페이지
   - 이메일 주소를 통해 로그인할 수 있습니다.

3. **/signup**
   - 회원가입 페이지
   - 이메일, 비밀번호, 이름 등으로 회원가입할 수 있습니다.

4. **/course/list**
   - 강의 목록 페이지
   - 강의 목록 조회, 검색·필터, 무한 스크롤(또는 페이지네이션)을 제공합니다.

5. **/course/create**
   - 강의 생성 페이지
   - 새 강의를 등록할 수 있습니다.

6. **/course/[courseId]**
   - 강의 상세 페이지
   - 강의 정보 확인 및 수강 신청이 가능합니다.

<br />

### 기능 설명

**1. 인증**

**useAuth** 훅 및 Server Actions에 로직 정리

- 1-1) 로그인 (signIn)
  - 이메일 주소로 인증 요청
  - 인증 성공 시 토큰 저장 및 강의 목록 등으로 이동

- 1-2) 회원가입 (signUp)
  - 이메일, 비밀번호, 이름 등으로 가입
  - 유효성 검사 후 가입 처리

- 1-3) 로그아웃 (signOut)
  - 세션/토큰 제거 후 로그인 페이지로 이동

**2. 강의 목록**

**useCourseList**, **courseQuery**에 로직 정리

- 2-1) 강의 목록 조회
  - TanStack Query로 강의 목록 패칭 및 관리
  - 검색·필터·정렬 지원

**3. 강의 상세**

**useCourseDetail** 훅에 로직 정리

- 3-1) 강의 상세 조회
  - 강의 ID 기준 상세 정보 패칭
  - 수강 신청 버튼 및 상태 표시

**4. 강의 생성**

**useCourseCreateForm** 훅 및 **createCourse** validation에 로직 정리

- 4-1) 강의 등록
  - Server Action으로 강의 생성
  - 폼 유효성 검사 후 제출

**5. 수강 신청**

**enrollCourse**, **enrollCourseBatch** Server Action

- 5-1) 수강 신청
  - 강의 상세에서 단건 수강 신청
  - 일괄 수강 신청 지원 (enrollCourseBatch)

<br />

### 구현내용

**Feature-Sliced 아키텍처**
타입 안정된

- 타입 안정한 API 레이어
  - /v3/api-docs 에서
    OpenAPI 스펙 기반으로 API 스키마를
- 서버/클라이언트 응답 처리 일원화
- tanstack query: 무한 스크롤 + prefetch + cache + revalidate
- 보안: httpOnly
- 테마: beforeInteractive + css variable
- skeleton + error
- 테스트
- SSR: URL 기반 데이터 패치 + supsense 분리로 concurrent
- 중복 제거: 공용 컴포넌트 + 레이아웃
- 직관적이고 사용성 높은 UI, 픽셀단위 계산한 layout
