'use client';

import Image from 'next/image';

export default function SplashScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Image 
        src="/보인당logo_purple.png" // 로고 이미지 경로는 실제 경로에 맞게 조정해주세요.
        alt="보인당 로고"
        width={150} // 로고 크기 조정
        height={60} // 로고 크기 조정
        priority // 스플래시 화면에서는 로고를 빨리 로드하는 것이 좋음
      />
    </div>
  );
} 