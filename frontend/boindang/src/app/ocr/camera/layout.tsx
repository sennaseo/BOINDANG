import React from 'react';

// 카메라 페이지는 전체 화면을 사용하므로, RootLayout의 스타일링된 div를 적용하지 않습니다.
// 이 레이아웃은 html, body 등의 기본 구조는 RootLayout에서 상속받되,
// RootLayout 내부의 특정 컨테이너 스타일은 적용받지 않도록 합니다.
export default function OcrCameraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // children만 반환하여 RootLayout의 추가적인 div 래퍼 없이 페이지 내용만 렌더링합니다.
  // 필요하다면 여기에 카메라 페이지에만 특화된 최소한의 html 구조(예: 상태 바 색상 변경을 위한 meta 태그 설정 로직)를 추가할 수 있습니다.
  // 단, status bar 등의 설정은 page.tsx에서 useEffect로 처리하는 것이 더 일반적입니다.
  return <>{children}</>;
} 