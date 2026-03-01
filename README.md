# course-system

## Prerequisites

아래 환경에서 개발되었습니다.

- Node.js v20.x
- npm 11.x

### 1. Repository Clone

```bash
git clone https://github.com/sjhong98/course-system.git
cd course-system
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

## 폴더 구조

```
app/                          # 라우팅·레이아웃 (Next.js App Router)
├── layout.tsx                # 루트 레이아웃
├── page.tsx                  # 메인(/) - 로그인으로 리다이렉트
├── Providers.tsx             # React Query 등 Provider
├── globals.css               # 전역 스타일
├── error.tsx                 # 전역 에러 바운더리
├── loading.tsx               # 전역 로딩 UI
├── fonts/                    # 폰트 파일
├── signin/                   # /signin - 로그인 페이지
├── signup/                   # /signup - 회원가입 페이지
└── course/
    ├── list/                 # /course/list - 강의 목록
    ├── create/               # /course/create - 강의 생성
    └── [courseId]/           # /course/[courseId] - 강의 상세

features/                     # 기능 단위 모듈 (Feature-Sliced)
├── auth/                     # 인증 (로그인·회원가입·로그아웃)
│   ├── action/               # Server Actions (signIn, signUp, signOut 등)
│   ├── components/           # 인증 관련 UI 컴포넌트
│   ├── hooks/                # 인증 관련 훅
│   └── validation/           # 로그인·회원가입 폼 유효성 검사
└── course/                   # 강의 (목록·상세·생성·수강 신청)
    ├── action/               # Server Actions (getCourseList, getCourse, createCourse, enrollCourse 등)
    ├── components/           # 강의 관련 UI·Container 컴포넌트
    ├── hooks/                # 강의 목록·상세·생성 폼 등 훅
    ├── query/                # TanStack Query 옵션 (강의 목록 infinite query 등)
    ├── utils/                # 강의 도메인 유틸 (정렬 파싱 등)
    └── validation/           # 강의 생성 폼 유효성 검사

shared/                       # 공용 레이어 (여러 feature에서 사용)
├── components/
│   ├── ui/                   # 버튼, 입력, 헤더 등 공용 UI 컴포넌트
│   ├── container/            # MobileWrapper 등 레이아웃 래퍼
│   └── flexBox/              # Row, Column 등 레이아웃 컴포넌트
├── hooks/                    # useAuth, useQueryParams 등 공용 훅
├── libs/
│   ├── api/                  # API 클라이언트·스키마 타입 (scheme.d.ts)
│   ├── constants/            # 레이아웃 상수 등
│   └── utils/                # apiResponseHandler, errorHandler, formatNumber 등
└── validation/               # 공통 유효성 규칙(rules)·ValidationResult 타입
```

<br />
<br />

## 페이지 구성

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
<br />

## 기능 설명

**1. 인증**

**useAuth** 훅, **useSignInForm** / **useSignUpForm** 훅 및 **signIn** / **signUp** / **signOut** Server Action에 로직 정리

- 1-1) 로그인 (signIn)
  - 이메일·비밀번호로 인증 요청 (useSignInForm, validateSignInForm)
  - 인증 성공 시 completeSignIn 호출 후 강의 목록으로 이동

- 1-2) 회원가입 (signUp)
  - 이름, 이메일, 휴대폰 번호, 비밀번호, 역할(학생/강사)으로 가입 (useSignUpForm, validateSignUpForm)
  - 유효성 검사 후 가입 처리, 이후 자동 로그인

- 1-3) 로그아웃 (signOut)
  - signOut 액션 및 completeSignOut으로 로그인 페이지로 이동

<br />

**2. 강의 목록**

**useCourseList**, **courseListQueryOptions** (courseQuery)에 로직 정리

- 2-1) 강의 목록 조회
  - TanStack Query(infiniteQuery)로 강의 목록 패칭 및 관리
  - 정렬 지원(recent / popular / rate), 무한 스크롤

<br />

**3. 강의 상세**

**useCourseDetail** 훅에 로직 정리

- 3-1) 강의 상세 조회
  - 강의 ID 기준 상세 정보 표시 (페이지에서 전달받은 course 사용)
  - 수강 신청 버튼 및 처리 (useEnrollCourse 연동)

<br />

**4. 강의 생성**

**useCourseCreateForm** 훅, **createCourse** Server Action, **validateCourseCreateForm** (validation/createCourse)에 로직 정리

- 4-1) 강의 등록
  - Server Action으로 강의 생성
  - 폼 유효성 검사 후 제출

<br />

**5. 수강 신청**

**useEnrollCourse** / **useEnrollCourseBatch** 훅 및 **enrollCourse** / **enrollCourseBatch** Server Action

- 5-1) 수강 신청
  - 강의 상세에서 단건 수강 신청 (useEnrollCourse)
  - 강의 목록에서 일괄 수강 신청 지원 (useEnrollCourseBatch, select 모드)

<br />
<br />

## 구현내용

- **Feature-Sliced 아키텍처**
  - app + features + shared 3개 레이어 사용
  - 라우팅과 기능 분리
    - app 하위의 page는 feature를 가져와 조합하는 역할로 한정
    - UI, 로직 등은 feature에 최대한 분리

<br />

- **UI와 로직 분리**
  - 비즈니스 로직은 커스텀 훅으로 분리
    - 강의 생성, 강의 조회, 수강 신청 등 세부 로직 훅으로 분리
    - 고도화될 경우 대응하기 위한 확장 가능성 고려하여 세부적으로 분리

<br />

- **타입 안정한 API 레이어**
  - openapi-typescript를 통해 API 스키마 자동 생성 (`/v3/api-docs` → `scheme.d.ts`)

    ```json
    "scripts": {
      "api": "npx openapi-typescript http://localhost:8080/v3/api-docs -o shared/libs/api/scheme.d.ts"
    }
    ```

  - API 요청 및 응답값 사용 시 타입 자동 추론
  - 경로/메소드별 Request/Response 타입 추출 가능한 TypeGenerator를 이용하여 타입 지정

    ```typescript
    type CourseCreateForm = ApiRequest<'/api/courses', 'post'>
    ```

<br />

- **서버/클라이언트 응답 처리 일원화**
  - 서버 액션에서 API를 호출한 뒤, 응답/에러 값을 직렬화 가능한 형태로 클라이언트에게 전달
    - serializableResponse
    - 서버 → 클라이언트로 직렬화되어 전달되는 과정에서 Response 객체 없어지므로, 미리 직렬화하여 전달
  - 클라이언트에서는 동일한 규칙으로 성공/에러 처리
    - apiResponseHandler / apiSyncResponseHandler
    - 성공값은 반환하고, 2xx 제외한 응답값은 throw → 타입 추론
    - 에러 UI 자동 처리
    - 401 에러에 대한 리다이렉트 처리

<br />

- **Tanstack Query: 무한 스크롤 + prefetch + cache + revalidate**
  - Tanstack Query 활용한 강의목록 패치 및 상태 관리
  - 무한 스크롤 (infiniteQueryOptions)
    - 끝에서 4번째 아이템에 trigger 배치 → 여유공간 통한 조기 데이터 패치로 자연스러운 스크롤 구현
  - Fallback 일원화 (useSuspenseInfiniteQuery)
    - suspense fallback와 isFetching를 동일한 Loading UI로 일원화 → 버벅임 없음
  - Server Prefetch (prefetchInfiniteQuery)
    - 서버에서 첫 페이지 먼저 조회하여 캐시에 저장
  - cache 설정 (gcTime)
    - 강의 업데이트 시 revalidate

    ```typescript
    await queryClient.invalidateQueries({ queryKey: ['courses'] })
    ```

<br />

- **보안: httpOnly**
  - 서버 액션을 이용하여 액세스 토큰을 httpOnly 쿠키로 저장 (signIn)
  - 액세스 토큰 포함해야 하는 API는 서버 액션에서만 호출

<br />

- **테마: CSS variable**
  - `:root`와 `.dark`로 구분하여 CSS variable로 스타일 적용

    ```txt
    checked:bg-[var(--background-secondary)] checked:border-[var(--background-secondary)]
    ```

  - cookie로 theme 관리 → FOUC 없는 테마 구현

<br />

- **SSR: URL 기반 데이터 패치 + Suspense 분리로 concurrent**
  - URL 기반 데이터 패치
    - courseId, sort 등 URL 상태값 기반 서버 컴포넌트 데이터 패치
  - Suspense 분리
    - concurrent rendering을 통해 데이터 패치 지연 발생하는 영역만 fallback 적용

<br />

- **직관적이고 사용성 높은 UI, 픽셀 단위 계산한 layout**
  - 레이아웃 상수를 한 곳에서 관리하여, 픽셀 단위의 레이아웃 구현
  - MobileWrapper를 이용한 모바일 웹 화면 구현

<br />

- **에러 바운더리 + 공용 Error 컴포넌트 + errorHandler 3단계의 에러 핸들링 구조**
