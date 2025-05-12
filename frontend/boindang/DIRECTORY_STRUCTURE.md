# 프로젝트 디렉토리 구조 가이드

이 문서는 우리 프로젝트의 프론트엔드 디렉토리 구조와 각 폴더의 주요 역할을 설명합니다. 일관성 있는 코드베이스 유지를 위해 이 가이드를 따라주세요.

## 주요 디렉토리 설명

### `src/`

애플리케이션의 주요 소스 코드가 위치하는 곳입니다.

-   **`src/app/` (Next.js App Router 사용 시)**
    -   **역할:** 페이지 라우팅 및 각 페이지 컴포넌트가 위치합니다. Next.js의 App Router 규약을 따릅니다.
    -   **예시:** `src/app/login/page.tsx`, `src/app/signup/layout.tsx`

-   **`src/pages/` (Next.js Pages Router 사용 시)**
    -   **역할:** 페이지 라우팅 및 각 페이지 컴포넌트, API 라우트 핸들러가 위치합니다. Next.js의 Pages Router 규약을 따릅니다.
    -   **예시:** `src/pages/login.tsx`, `src/pages/api/hello.ts`

-   **`src/components/`**
    -   **역할:** 여러 페이지나 다른 컴포넌트에서 재사용될 수 있는 UI 컴포넌트들을 모아둡니다.
    -   **세부 구조 (예시):**
        -   `src/components/common/`: 버튼, 인풋 필드 등 범용적인 기본 컴포넌트
        -   `src/components/ui/`: 레이아웃, 카드, 모달 등 조금 더 복합적인 UI 요소
        -   `src/components/domain/product/`: '상품' 도메인에 특화된 컴포넌트 (예: `ProductCard.tsx`)
    -   **예시:** `src/components/common/Button.tsx`, `src/components/ui/Modal.tsx`

-   **`src/api/`**
    -   **역할:** **백엔드 API 서버와 직접 통신하는 함수들을 모아두는 곳입니다.** 각 함수는 특정 API 엔드포인트에 대한 요청(GET, POST, PUT, DELETE 등)을 수행하고, 응답 데이터를 반환합니다. `src/lib/apiClient.ts` 에서 생성된 `axios` 인스턴스를 사용합니다.
    -   **세부 구조 (권장):** 도메인별로 파일을 분리합니다 (예: `auth.ts`, `products.ts`).
    -   **예시:** `src/api/auth.ts` (내부에 `postSignUp`, `login` 함수 등), `src/api/products.ts`

-   **`src/hooks/`**
    -   **역할:** React 커스텀 훅들을 모아둡니다. 상태 로직, 사이드 이펙트 관리 등 재사용 가능한 로직을 훅으로 추출하여 사용합니다.
    -   **세부 구조 (예시):**
        -   `src/hooks/queries/`: TanStack Query의 `useQuery` 관련 훅들 (데이터 조회)
        -   `src/hooks/mutations/`: TanStack Query의 `useMutation` 관련 훅들 (데이터 변경)
        -   `src/hooks/common/`: 기타 일반적인 커스텀 훅 (예: `useFormInput.ts`, `useDebounce.ts`)
    -   **예시:** `src/hooks/mutations/useAuthMutations.ts`, `src/hooks/common/useWindowSize.ts`

-   **`src/lib/`**
    -   **역할:** **애플리케이션 전반에서 사용될 수 있는 독립적인 유틸리티 함수, 외부 서비스 클라이언트 설정, 상수 등을 모아둡니다.** 특정 도메인에 종속되지 않고 범용적으로 사용될 수 있는 코드들입니다.
    -   **주요 내용:**
        -   **`apiClient.ts`**: `axios` 인스턴스 생성 및 기본 설정 (API 통신의 기반).
        -   유틸리티 함수 (예: `formatDate.ts`, `validationUtils.ts`).
        -   상수 (예: `constants.ts`).
    -   **`src/api/` 와의 관계:** `src/api/` 내의 함수들이 `src/lib/apiClient.ts` 를 가져와 사용합니다. `lib` 은 더 범용적이고 낮은 레벨의 도구를 제공하고, `api` 는 이 도구를 사용하여 실제 통신 작업을 수행합니다.
    -   **예시:** `src/lib/apiClient.ts`, `src/lib/utils/formatters.ts`

-   **`src/stores/`**
    -   **역할:** 전역 상태 관리 라이브러리(예: Zustand, Recoil, Jotai)의 스토어 정의 파일들을 모아둡니다.
    -   **예시:** `src/stores/signupStore.ts`, `src/stores/userStore.ts`

-   **`src/styles/`**
    -   **역할:** 전역 CSS 파일, Tailwind CSS 설정 확장, CSS 변수 정의 등을 관리합니다.
    -   **예시:** `src/styles/globals.css`

-   **`src/types/`**
    -   **역할:** 애플리케이션 전반에서 사용되는 TypeScript 타입 정의들을 모아둡니다.
    -   **세부 구조 (예시):**
        -   `src/types/api/`: API 요청/응답 관련 타입 (예: `authTypes.ts`).
        -   `src/types/domain/`: 특정 도메인 객체 타입 (예: `product.ts`).
        -   `src/types/common.ts`: 기타 공통 타입.
    -   **예시:** `src/types/api/authTypes.ts`, `src/types/common.ts`

-   **`public/`**
    -   정적 에셋 (이미지, 폰트 등)이 위치합니다.

## 새로운 디렉토리 추가 시

새로운 기능을 개발하거나 코드를 리팩토링할 때, 위 구조를 참고하여 적절한 위치에 파일을 생성해주세요. 만약 새로운 최상위 디렉토리나 중요한 하위 디렉토리 구조 변경이 필요하다면, 팀과 논의 후 이 문서를 업데이트합니다.
