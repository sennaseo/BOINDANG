/**
 * SugarCubeContainer.tsx
 * 
 * 클라이언트 컴포넌트로 Three.js 각설탕 캐릭터 렌더링 담당
 * 
 * 이 컴포넌트는 Next.js의 서버 컴포넌트 환경에서 Three.js를 사용하기 위한 
 * 클라이언트 사이드 컨테이너입니다.
 * - 'use client' 지시어로 클라이언트 컴포넌트로 지정됩니다.
 * - dynamic import를 통해 서버 사이드 렌더링(SSR)을 비활성화하여 
 *   Three.js의 브라우저 종속성 문제를 해결합니다.
 * - 메인 페이지에서 각설탕 3D 렌더링을 담당합니다.
 */

'use client';

import dynamic from 'next/dynamic';

/**
 * Three.js는 브라우저 API(Canvas, WebGL)에 의존하기 때문에
 * 서버 사이드 렌더링 시 오류가 발생할 수 있습니다.
 * dynamic import와 ssr: false 옵션을 사용하여 
 * 클라이언트에서만 컴포넌트가 로드되도록 설정합니다.
 */
const SugarCubeScene = dynamic(
  () => import('./SugarCubeScene'),
  { ssr: false }
);

export default function SugarCubeContainer() {
  return (
    <div className="w-full h-full">
      {/* 
        동적으로 불러온 Three.js 씬 컴포넌트 
        클라이언트 사이드에서만 렌더링됩니다.
      */}
      <SugarCubeScene />
    </div>
  );
} 