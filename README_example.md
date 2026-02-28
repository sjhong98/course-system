# Switchwon-exercise

### Prerequisites

아래 환경에서 개발되었습니다.

- Node.js v20.19.0
- npm 10.8.2

### 1. Repository Clone

```bash
git clone https://github.com/sjhong98/{}.git
cd {}
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

로그인, 실시간 환율 조회, 환전, 내역 조회 기능이 구현된 서비스

<br />

### 기술 스택

- Framework/Language: Next.js, React, TypeScript
- State/Data Fetching: React Query, react-cookie, Fetch API
- UI: Tailwind CSS, react-toastify

<br />

### 폴더 구조

```
app/
├── layout.tsx              # 루트 레이아웃
├── page.tsx                # 메인(/) 페이지
├── clientLayout.tsx        # 클라이언트 레이아웃
├── globals.css
├── favicon.ico
│
├── (page)/                 # 라우트 그룹
│   ├── login/
│   │   └── page.tsx        # /login
│   └── (auth)/
│       ├── layout.tsx
│       └── (exchange)/
│           ├── layout.tsx  # 환전 관련 페이지 공통 레이아웃
│           └── exchange/
│               ├── page.tsx       # /exchange
│               └── history/
│                   └── page.tsx   # /exchange/history
│
├── [...not-found]/
│   └── page.tsx            # 404 페이지
│
├── api/
│   └── proxy/
│       └── route.ts        # API 프록시
│
├── components/
│   ├── common/             # 공용 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Container.tsx
│   │   ├── Dropdown.tsx
│   │   ├── ErrorContainer.tsx
│   │   ├── Input.tsx
│   │   ├── P.tsx
│   │   ├── SuffixInput.tsx
│   │   └── Tab.tsx
│   └── exchange/           # 환전 관련 공용 컴포넌트
│       ├── common/
│       │   ├── Header.tsx
│       │   └── Title.tsx
│       ├── dashboard/
│       │   ├── CurrencyDisplayPanel.tsx
│       │   ├── ExchangePanel.tsx
│       │   ├── MyWalletDisplayPanel.tsx
│       │   └── Ui.tsx
│       └── historyPanel/
│           └── Ui.tsx
│
├── config/                 # Tanstack-Query 설정
│   └── queryConfig.ts
├── enums/                  # Enums
│   └── currencyEnum.ts
├── fonts/
├── hooks/                  # Custom Hooks
│   ├── useApi.ts
│   ├── useAuth.ts
│   ├── useExchange.ts
│   ├── useExchangeRate.ts
│   └── useWallet.ts
├── lib/                    # 공용 유틸리티 함수
│   ├── formatNumber.ts
│   ├── normalizeCurrency.ts
│   ├── parseNumber.ts
│   └── toast.ts
├── providers/              # Providers
│   └── QueryProvider.tsx
└── types/                  # Types
    ├── Currency.ts
    ├── Exchange.ts
    ├── ExchangeRate.ts
    └── Wallet.ts
```

<br />

### 페이지 구성

1. /login 
- 로그인 페이지
- 이메일 주소를 통해 로그인/회원가입을 할 수 있습니다.

2. /exchange
- 환전 대시보드
- 실시간 환율을 확인할 수 있습니다.
- 내 지갑을 확인할 수 있습니다.
- 원하는 통화를 환전할 수 있습니다.

3. /exchange/history
- 환전내역 조회

<br />

### 기능 설명

**1. 인증**

**useAuth** 훅에 로직 정리

    1-1) 로그인 / 회원가입 (signIn)
    - 이메일 주소로 인증 요청
    - 이메일 미입력 예외 처리
    - 인증 성공 시 반환된 accessToken을 쿠키에 저장
    - sameSite, secure 보안 옵션 적용

    1-2) 세션 확인 (checkSession)
    - 내 지갑 조회 API를 통해 세션 확인
    - 세션 확인 실패시 로그인 페이지로 이동
    - (exchange) 라우트 layout에서 동작

    1-3) 로그아웃 (signOut)
    - accessToken을 삭제하고 로그인 페이지로 이동

    
**2. 실시간 환율 조회**

**useExchangeRate** 훅에 로직 정리

    2-1) 실시간 환율 조회
    - Tanstack Query로 실시간 환율 정보 패칭 및 관리
    - 캐싱 기간 및 리패칭 인터벌 1분으로 설정하여, 1분 간격으로 갱신

**3. 내 지갑 확인**

**useWallet** 훅에 로직 정리

    3-1) 내 지갑 조회
    - Tanstack Query로 내 지갑 정보 패칭 및 관리

**4. 환전**

**useExchange** 훅에 로직 정리

    4-1) 주문 (order)
    - /orders API로 주문 요청
    - 금액 미입력, 보유금액 초과 시 환전하기 버튼 disabled 처리 및 에러 UI 표시
    - 환율 갱신 시 견적 내용과 교차검증하여, 서로 다를 경우 동기화
    - 환전 완료시, 내 지갑 정보 갱신

    4-2) 견적 조회 (getQuote)
    - /orders/quote API로 견적 조회 요청
    - debounce 200ms 적용
    - 견적 요청 시 환율과 교차검증하여, 서로 다를 경우 동기화

    4-3) 환전 내역 조회 (getExchangeHistory)
    - Tanstack Query로 환전 내역 패칭 및 관리

<br />

## 구현 내용

### Proxy
- 서버 API의 CORS 미허용으로 인해, Next.js 자체 서버 라우트를 proxy로 사용하여 우회
- proxy는 CORS 우회만 담당하고, 요청/응답을 변형하지 않도록 설계

### 데이터 패치
- useApi 훅을 사용해 데이터 패치
- accessToken을 Authorization Header에 실어서 요청 전송
- 공통 에러 핸들링 로직
    - 에러 메세지 UI 표시
    - 401 권한 에러 발생 시 로그인 이동

### 상태 관리
- 실시간 환율 / 내 지갑 / 환전 내역 -> Tanstack Query로 관리
- Tanstack Query를 통해 Context API로 전역 상태로 관리
- 상태별 gcTime, refetchInterval 옵션 각각 설정

### 공용 컴포넌트
디자인 시안에 맞는 표준화된 UI 제공
- Button: UI 옵션, disabled 기능 제공
- Container: UI 옵션 제공
- Dropdown: animated UI
- ErrorContainer: Tanstack Query error 시 표시, refetch 버튼 포함
- Input: label, suffix, error message 기능 제공
- P: element 변경, ellisis, skeleton 기능 제공
- Tab

### 에러 처리 / 로딩 처리
- 요청 에러 발생시 useApi에서 에러 UI 표시 및 throw
- 이후 개별 함수에서 에러 처리
- ex) Tanstack Query function 실패시 에러 UI 및 재시도 버튼 표시 (refetch 함수 연결)
- Tanstack Query loading 상태값으로 skeleton 처리
- P 태그에 loading 값 전달하여 skeleton 표준화

### 성능 최적화 및 UX 예외 처리
- useMemo, useCallback 사용
- 폼 validation, 빈 화면 처리

### 반응형 구현
- Tailwind CSS prefix 사용하여 반응형 구현
- lg(Desktop)/md(Tablet)/sm(Mobile)

### 라우트 그룹 / 레이아웃
- (page), (exchange) 등 라우트 그룹
- URL은 그대로 사용하고, 레이아웃만 분리
- Auth Guard는 (exchange) 하위에서만 사용



























 
