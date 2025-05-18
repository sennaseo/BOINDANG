'use client';

import { useRef } from 'react';
import { CameraPlus, CaretRight, SealPercent } from '@phosphor-icons/react';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { usePreventSwipeBack } from '@/hooks/usePreventSwipeBack';

// 클라이언트 사이드에서만 로드하기 위해 dynamic import 사용
const DangDangi = dynamic(() => import('@/components/3D/DangDangi'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-maincolor animate-pulse font-medium">로딩 중...</p>
    </div>
  ),
});

export default function Home() {
  const mainContainerRef = useRef<HTMLDivElement>(null);

  usePreventSwipeBack(mainContainerRef, { edgeThreshold: 30 });

  return (
    <div ref={mainContainerRef} className="flex flex-col min-h-screen bg-[#F8F8F8] relative">
      {/* 상단 로고/설정 */}
      <header className="flex justify-between items-center pt-6 px-5 absolute top-0 left-0 right-0 z-10">
        <div className="relative">
          <Image src="/보인당black.png" alt="보인당 로고" width={126} height={40} />
        </div>
      </header>

      <main className="absolute inset-0 flex flex-col">
        {/* 중앙(애니메이션/그림 자리) */}
        {/* 당당이 컴포넌트 - 화면 전체 차지 */}
        <div className="w-full h-full">
          <DangDangi />
        </div>
      </main>


      {/* 하단 분석 버튼 영역 */}
      <div className="absolute bottom-25 left-0 right-0 px-5 z-10">
        <div className="space-y-3 mb-5">
          {/* 퀴즈 미션 알림 */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md p-4">
            <div className="flex items-center">
              <div className="mr-3 text-white">
                <SealPercent size={28} weight="fill" />
              </div>
              <div className="flex-1 text-white">
                <h3 className="font-bold">오늘의 퀴즈 미션</h3>
                <p className="text-sm opacity-90">건강 퀴즈를 풀고 보상을 받아보세요!</p>
              </div>
              <button className="bg-white text-blue-600 px-3 py-1.5 rounded-lg font-bold text-sm flex items-center">
                수행하기
                <CaretRight size={16} weight="bold" className="ml-1" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 flex flex-col items-center justify-center">
            <div className="text-sm font-bold text-gray-500 mb-1">지금까지 분석한 식품</div>
            <div className="text-2xl font-bold text-maincolor">20개</div>
            <div className="mt-1 text-xs text-gray-500">대단해요!</div>
          </div>
          <button className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-maincolor to-blue-500 text-white rounded-xl p-4 font-bold text-lg shadow-md hover:shadow-lg transition-shadow">
            <CameraPlus size={26} weight="bold" />
            <div>식품 분석</div>
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="mt-auto">
        <BottomNavBar />
      </div>
    </div>
  );
}
